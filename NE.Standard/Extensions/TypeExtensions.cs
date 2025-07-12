using System;
using System.Linq;
using System.Reflection;

namespace NE.Standard.Extensions
{
    /// <summary>
    /// Extensions for working with <see cref="Type"/> instances.
    /// </summary>
    public static class TypeExtensions
    {
        /// <summary>
        /// Creates an instance of the given type with optional constructor parameters.
        /// </summary>
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
        /// Tries to resolve a Type from the given type name using all loaded assemblies.
        /// </summary>
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
