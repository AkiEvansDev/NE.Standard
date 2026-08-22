using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Controllers;

internal sealed class UICommandInvoker
{
    private readonly record struct CommandParameter(string Name, Type Type, bool HasDefaultValue, object? DefaultValue);

    private readonly Func<object, object?[], CancellationToken, Task<UICommandResult>> _invoke;
    private readonly CommandParameter[] _parameters;
    private readonly string _commandName;

    private UICommandInvoker(Func<object, object?[], CancellationToken, Task<UICommandResult>> invoke, CommandParameter[] parameters, string commandName)
    {
        _invoke = invoke;
        _parameters = parameters;
        _commandName = commandName;
    }

    public static UICommandInvoker Create(Type controllerType, MethodInfo method, string commandName)
    {
        ArgumentNullException.ThrowIfNull(controllerType);
        ArgumentNullException.ThrowIfNull(method);
        ArgumentException.ThrowIfNullOrWhiteSpace(commandName);

        if (method.ContainsGenericParameters)
            throw new InvalidOperationException($"Command '{commandName}' must not be generic.");

        if (!controllerType.IsAssignableFrom(method.DeclaringType) && !method.DeclaringType!.IsAssignableFrom(controllerType))
            throw new InvalidOperationException($"Command '{commandName}' does not belong to controller type '{controllerType.Name}'.");

        ParameterInfo[] methodParameters = method.GetParameters();
        var hasCancellationToken = methodParameters.Length > 0 && methodParameters[^1].ParameterType == typeof(CancellationToken);

        for (var i = 0; i < methodParameters.Length; i++)
        {
            if (methodParameters[i].ParameterType == typeof(CancellationToken) && i != methodParameters.Length - 1)
                throw new InvalidOperationException($"CancellationToken must be the last parameter in command '{commandName}'.");
        }

        var commandParameterCount = hasCancellationToken
            ? methodParameters.Length - 1
            : methodParameters.Length;

        CommandParameter[] parameters = new CommandParameter[commandParameterCount];

        HashSet<string> names = new(StringComparer.Ordinal);
        for (var i = 0; i < commandParameterCount; i++)
        {
            ParameterInfo parameter = methodParameters[i];

            if (string.IsNullOrWhiteSpace(parameter.Name))
                throw new InvalidOperationException($"Parameter #{i} in command '{commandName}' has no name.");

            if (!names.Add(parameter.Name))
                throw new InvalidOperationException($"Parameter '{parameter.Name}' is duplicated in command '{commandName}'.");

            parameters[i] = new CommandParameter(parameter.Name, parameter.ParameterType, parameter.HasDefaultValue, parameter.HasDefaultValue ? parameter.DefaultValue : null);
        }

        Func<object, object?[], CancellationToken, Task<UICommandResult>> invoke = Compile(controllerType, method, methodParameters);

        return new UICommandInvoker(invoke, parameters, commandName);
    }

    private static Func<object, object?[], CancellationToken, Task<UICommandResult>> Compile(Type controllerType, MethodInfo method, ParameterInfo[] parameters)
    {
        ParameterExpression controllerParameter = Expression.Parameter(typeof(object), "controller");
        ParameterExpression argumentsParameter = Expression.Parameter(typeof(object[]), "arguments");
        ParameterExpression cancellationTokenParameter = Expression.Parameter(typeof(CancellationToken), "cancellationToken");

        // Null for a static command, which is a command that only returns effects. Refusing one would put the
        // runtime at odds with the analyzers this repository builds under: a method that touches no instance
        // state raises CA1822, and taking that advice must not silently unregister the command.
        UnaryExpression? instance = method.IsStatic ? null : Expression.Convert(controllerParameter, controllerType);
        Expression[] callArguments = new Expression[parameters.Length];

        var argumentIndex = 0;
        for (var i = 0; i < parameters.Length; i++)
        {
            Type parameterType = parameters[i].ParameterType;

            if (parameterType == typeof(CancellationToken))
            {
                callArguments[i] = cancellationTokenParameter;
                continue;
            }

            BinaryExpression arrayIndex = Expression.ArrayIndex(argumentsParameter, Expression.Constant(argumentIndex));

            callArguments[i] = Expression.Convert(arrayIndex, parameterType);

            argumentIndex++;
        }

        MethodCallExpression call = Expression.Call(instance, method, callArguments);

        Expression body = WrapReturn(call, method.ReturnType);

        Expression<Func<object, object?[], CancellationToken, Task<UICommandResult>>> lambda = Expression.Lambda<Func<object, object?[], CancellationToken, Task<UICommandResult>>>(
            body,
            controllerParameter,
            argumentsParameter,
            cancellationTokenParameter
        );

        return lambda.Compile();
    }

    private static Expression WrapReturn(Expression call, Type returnType)
        => returnType switch
        {
            Type type when type == typeof(void) => Expression.Block(call, Expression.Call(typeof(UICommandInvoker), nameof(WrapVoid), Type.EmptyTypes)),
            Type type when type == typeof(UICommandResult) => Expression.Call(typeof(UICommandInvoker), nameof(WrapResult), Type.EmptyTypes, call),
            Type type when type == typeof(Task) => Expression.Call(typeof(UICommandInvoker), nameof(WrapTask), Type.EmptyTypes, call),
            Type type when type == typeof(Task<UICommandResult>) => call,
            Type type when type == typeof(ValueTask) => Expression.Call(typeof(UICommandInvoker), nameof(WrapValueTask), Type.EmptyTypes, call),
            Type type when type == typeof(ValueTask<UICommandResult>) => Expression.Call(typeof(UICommandInvoker), nameof(WrapValueTaskResult), Type.EmptyTypes, call),
            _ => throw new InvalidOperationException($"Unsupported command return type '{returnType.FullName}'.")
        };

    private static Task<UICommandResult> WrapVoid()
        => Task.FromResult(UICommandResult.Ok());

    private static Task<UICommandResult> WrapResult(UICommandResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        return Task.FromResult(result);
    }

    private static async Task<UICommandResult> WrapTask(Task task)
    {
        ArgumentNullException.ThrowIfNull(task);

        await task.ConfigureAwait(false);

        return UICommandResult.Ok();
    }

    private static async Task<UICommandResult> WrapValueTask(ValueTask task)
    {
        await task.ConfigureAwait(false);

        return UICommandResult.Ok();
    }

    private static async Task<UICommandResult> WrapValueTaskResult(ValueTask<UICommandResult> task)
    {
        UICommandResult result = await task.ConfigureAwait(false);

        return result ?? throw new InvalidOperationException("Command returned null UICommandResult.");
    }

    public Task<UICommandResult> Invoke(object controller, IReadOnlyDictionary<string, object?>? arguments, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(controller);

        var values = BuildArgumentArray(arguments);

        return _invoke(controller, values, cancellationToken);
    }

    private object?[] BuildArgumentArray(IReadOnlyDictionary<string, object?>? arguments)
    {
        if (_parameters.Length == 0)
            return [];

        var result = new object?[_parameters.Length];

        for (var i = 0; i < _parameters.Length; i++)
        {
            CommandParameter parameter = _parameters[i];

            if (arguments is not null && arguments.TryGetValue(parameter.Name, out var value))
            {
                result[i] = ConvertArgument(value, parameter.Type, _commandName, parameter.Name);
                continue;
            }

            if (parameter.HasDefaultValue)
            {
                result[i] = parameter.DefaultValue;
                continue;
            }

            if (!parameter.Type.IsValueType || Nullable.GetUnderlyingType(parameter.Type) is not null)
            {
                result[i] = null;
                continue;
            }

            throw new InvalidOperationException($"Command '{_commandName}' requires argument '{parameter.Name}'.");
        }

        return result;
    }

    private static object? ConvertArgument(object? value, Type targetType, string commandName, string parameterName)
    {
        if (value is null)
        {
            return !targetType.IsValueType || Nullable.GetUnderlyingType(targetType) is not null
                ? null
                : throw new InvalidOperationException($"Command '{commandName}' argument '{parameterName}' cannot be null.");
        }

        Type valueType = value.GetType();

        if (targetType.IsAssignableFrom(valueType))
            return value;

        Type conversionType = Nullable.GetUnderlyingType(targetType) ?? targetType;

        try
        {
            if (conversionType.IsEnum)
            {
                return value is string stringValue
                    ? Enum.Parse(conversionType, stringValue, ignoreCase: false)
                    : Enum.ToObject(conversionType, value);
            }

            if (conversionType == typeof(Guid))
            {
                return value is string guidString
                    ? (object)Guid.Parse(guidString)
                    : throw new InvalidOperationException($"Cannot convert '{valueType.FullName}' to '{targetType.FullName}'.");
            }

            if (conversionType == typeof(DateTime))
            {
                if (value is string dateTimeString)
                    return DateTime.Parse(dateTimeString, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
            }

            if (conversionType == typeof(DateTimeOffset))
            {
                if (value is string dateTimeOffsetString)
                    return DateTimeOffset.Parse(dateTimeOffsetString, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
            }

            if (value is IConvertible)
                return Convert.ChangeType(value, conversionType, CultureInfo.InvariantCulture);
        }
        catch (Exception exception) when (exception is FormatException or InvalidCastException or OverflowException or ArgumentException)
        {
            throw new InvalidOperationException($"Cannot convert command '{commandName}' argument '{parameterName}' from '{valueType.FullName}' to '{targetType.FullName}'.", exception);
        }

        throw new InvalidOperationException($"Cannot convert command '{commandName}' argument '{parameterName}' from '{valueType.FullName}' to '{targetType.FullName}'.");
    }
}
