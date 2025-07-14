using System;
using System.Reflection;

namespace NE.Standard.Types
{
    /// <summary>
    /// Represents the base class for weakly referenced delegates.
    /// Allows capturing the method and its target without preventing garbage collection of the target object.
    /// </summary>
    public abstract class WeakDelegate
    {
        protected readonly WeakReference? _targetRef;
        protected readonly MethodInfo _method;
        protected readonly bool _isStatic;

        /// <summary>
        /// Gets a value indicating whether the delegate's target is still alive (not collected), or if the method is static.
        /// </summary>
        public bool IsAlive => _isStatic || _targetRef?.IsAlive == true;

        protected WeakDelegate(Delegate @delegate)
        {
            _method = @delegate.Method ?? throw new ArgumentNullException(nameof(@delegate.Method));
            _isStatic = _method.IsStatic;

            if (!_isStatic)
            {
                if (@delegate.Target == null)
                    throw new ArgumentNullException(nameof(@delegate.Target), "Non-static delegate must have a target.");
                _targetRef = new WeakReference(@delegate.Target);
            }
        }
    }

    /// <summary>
    /// Represents a weak reference to a parameterless <see cref="Action"/> delegate.
    /// Prevents memory leaks by not keeping strong references to the target object.
    /// </summary>
    public class WeakAction : WeakDelegate
    {
        public WeakAction(Action action) : base(action) { }

        /// <summary>
        /// Executes the target <see cref="Action"/> if the target is still alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public void Execute()
        {
            if (_isStatic)
                _method.Invoke(null, null);
            else if (_targetRef?.Target is object target)
                _method.Invoke(target, null);
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the action. Returns <c>false</c> if execution fails or the target has been collected.
        /// </summary>
        public bool TryExecute()
        {
            try { Execute(); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to an <see cref="Action{T}"/> delegate with one parameter.
    /// </summary>
    public class WeakAction<T> : WeakDelegate
    {
        public WeakAction(Action<T> action) : base(action) { }

        /// <summary>
        /// Executes the target <see cref="Action{T}"/> if the target is still alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public void Execute(T arg1)
        {
            if (_isStatic)
                _method.Invoke(null, new object?[] { arg1 });
            else if (_targetRef?.Target is object target)
                _method.Invoke(target, new object?[] { arg1 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the action. Returns <c>false</c> if execution fails or the target has been collected.
        /// </summary>
        public bool TryExecute(T arg1)
        {
            try { Execute(arg1); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to an <see cref="Action{T1, T2}"/> delegate with two parameters.
    /// </summary>
    public class WeakAction<T1, T2> : WeakDelegate
    {
        public WeakAction(Action<T1, T2> action) : base(action) { }

        /// <summary>
        /// Executes the target <see cref="Action{T1, T2}"/> if the target is still alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public void Execute(T1 arg1, T2 arg2)
        {
            if (_isStatic)
                _method.Invoke(null, new object?[] { arg1, arg2 });
            else if (_targetRef?.Target is object target)
                _method.Invoke(target, new object?[] { arg1, arg2 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the action. Returns <c>false</c> if execution fails or the target has been collected.
        /// </summary>
        public bool TryExecute(T1 arg1, T2 arg2)
        {
            try { Execute(arg1, arg2); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to an <see cref="Action{T1, T2, T3}"/> delegate with three parameters.
    /// </summary>
    public class WeakAction<T1, T2, T3> : WeakDelegate
    {
        public WeakAction(Action<T1, T2, T3> action) : base(action) { }

        /// <summary>
        /// Executes the target <see cref="Action{T1, T2, T3}"/> if the target is still alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public void Execute(T1 arg1, T2 arg2, T3 arg3)
        {
            if (_isStatic)
                _method.Invoke(null, new object?[] { arg1, arg2, arg3 });
            else if (_targetRef?.Target is object target)
                _method.Invoke(target, new object?[] { arg1, arg2, arg3 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the action. Returns <c>false</c> if execution fails or the target has been collected.
        /// </summary>
        public bool TryExecute(T1 arg1, T2 arg2, T3 arg3)
        {
            try { Execute(arg1, arg2, arg3); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to a parameterless <see cref="Func{TResult}"/> delegate.
    /// </summary>
    public class WeakFunc<TResult> : WeakDelegate
    {
        public WeakFunc(Func<TResult> func) : base(func) { }

        /// <summary>
        /// Executes the function and returns the result, if the target is alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public TResult Execute()
        {
            if (_isStatic)
                return (TResult)_method.Invoke(null, null);
            else if (_targetRef?.Target is object target)
                return (TResult)_method.Invoke(target, null);
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the function. Returns <c>false</c> if execution fails or the target is no longer alive.
        /// </summary>
        public bool TryExecute(out TResult result)
        {
            result = default!;
            try { result = Execute(); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to a <see cref="Func{T, TResult}"/> delegate with one parameter.
    /// </summary>
    public class WeakFunc<T, TResult> : WeakDelegate
    {
        public WeakFunc(Func<T, TResult> func) : base(func) { }

        /// <summary>
        /// Executes the function and returns the result, if the target is alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public TResult Execute(T arg1)
        {
            if (_isStatic)
                return (TResult)_method.Invoke(null, new object?[] { arg1 });
            else if (_targetRef?.Target is object target)
                return (TResult)_method.Invoke(target, new object?[] { arg1 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the function. Returns <c>false</c> if execution fails or the target is no longer alive.
        /// </summary>
        public bool TryExecute(T arg1, out TResult result)
        {
            result = default!;
            try { result = Execute(arg1); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to a <see cref="Func{T1, T2, TResult}"/> delegate with two parameters.
    /// </summary>
    public class WeakFunc<T1, T2, TResult> : WeakDelegate
    {
        public WeakFunc(Func<T1, T2, TResult> func) : base(func) { }

        /// <summary>
        /// Executes the function and returns the result, if the target is alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public TResult Execute(T1 arg1, T2 arg2)
        {
            if (_isStatic)
                return (TResult)_method.Invoke(null, new object?[] { arg1, arg2 });
            else if (_targetRef?.Target is object target)
                return (TResult)_method.Invoke(target, new object?[] { arg1, arg2 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the function. Returns <c>false</c> if execution fails or the target is no longer alive.
        /// </summary>
        public bool TryExecute(T1 arg1, T2 arg2, out TResult result)
        {
            result = default!;
            try { result = Execute(arg1, arg2); return true; }
            catch { return false; }
        }
    }

    /// <summary>
    /// Represents a weak reference to a <see cref="Func{T1, T2, T3, TResult}"/> delegate with three parameters.
    /// </summary>
    public class WeakFunc<T1, T2, T3, TResult> : WeakDelegate
    {
        public WeakFunc(Func<T1, T2, T3, TResult> func) : base(func) { }

        /// <summary>
        /// Executes the function and returns the result, if the target is alive.
        /// </summary>
        /// <exception cref="InvalidOperationException">Thrown if the delegate target has been garbage collected.</exception>
        public TResult Execute(T1 arg1, T2 arg2, T3 arg3)
        {
            if (_isStatic)
                return (TResult)_method.Invoke(null, new object?[] { arg1, arg2, arg3 });
            else if (_targetRef?.Target is object target)
                return (TResult)_method.Invoke(target, new object?[] { arg1, arg2, arg3 });
            else
                throw new InvalidOperationException("Target has been garbage collected.");
        }

        /// <summary>
        /// Attempts to execute the function. Returns <c>false</c> if execution fails or the target is no longer alive.
        /// </summary>
        public bool TryExecute(T1 arg1, T2 arg2, T3 arg3, out TResult result)
        {
            result = default!;
            try { result = Execute(arg1, arg2, arg3); return true; }
            catch { return false; }
        }
    }
}
