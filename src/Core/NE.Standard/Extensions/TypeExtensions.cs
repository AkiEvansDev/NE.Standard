using System;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Provides extension methods for working with <see cref="Type"/> instances,
    /// including instance creation and runtime type resolution.
    /// </summary>
    public static class TypeExtensions
    {
        /// <summary>
        /// Returns a new instance of the type, using the given constructor arguments.
        /// </summary>
        /// <returns>A newly created instance of the specified <see cref="Type"/>.</returns>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="type"/> is <c>null</c>.</exception>
        /// <exception cref="MissingMethodException">Thrown when no matching constructor is found.</exception>
        /// <exception cref="InvalidOperationException">Thrown when the instance cannot be created.</exception>
        public static object CreateInstance(this Type type, object[]? parameters = null)
        {
            if (type == null)
                throw new ArgumentNullException(nameof(type));

            if (type.IsArray)
                return Activator.CreateInstance(type, 0);

            if (parameters == null || parameters.Length == 0)
            {
                try
                {
                    return Activator.CreateInstance(type);
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException($"Failed to create an instance of type '{type.FullName}'.", ex);
                }
            }

            var constructor = type
                .GetConstructors()
                .FirstOrDefault(ctor => AreParametersCompatible(ctor.GetParameters(), parameters))
                ?? throw new MissingMethodException($"No suitable constructor found for type '{type.FullName}' with the provided parameters.");

            try
            {
                return constructor.Invoke(parameters);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to invoke constructor for type '{type.FullName}'.", ex);
            }
        }

        /// <summary>
        /// Resolves the type by name from all loaded assemblies.
        /// </summary>
        /// <returns>The resolved <see cref="Type"/> if found.</returns>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="typeName"/> is <c>null</c> or whitespace.</exception>
        /// <exception cref="TypeLoadException">Thrown when the type cannot be resolved from any loaded assemblies.</exception>
        public static Type ResolveType(this string typeName)
        {
            if (string.IsNullOrWhiteSpace(typeName))
                throw new ArgumentNullException(nameof(typeName));

            var type = Type.GetType(typeName, false);
            if (type != null)
                return type;

            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                type = assembly.GetType(typeName, false);
                if (type != null)
                    return type;
            }

            throw new TypeLoadException($"Type '{typeName}' could not be found in loaded assemblies.");
        }

        private static bool AreParametersCompatible(ParameterInfo[] parameterInfos, object[] arguments)
        {
            if (parameterInfos.Length != arguments.Length)
                return false;

            for (int i = 0; i < parameterInfos.Length; i++)
            {
                var expectedType = parameterInfos[i].ParameterType;
                var actualArg = arguments[i];

                if (actualArg == null)
                {
                    if (expectedType.IsValueType && Nullable.GetUnderlyingType(expectedType) == null)
                        return false;
                    continue;
                }

                if (!expectedType.IsInstanceOfType(actualArg))
                    return false;
            }

            return true;
        }
    }
}
