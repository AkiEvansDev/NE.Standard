window.designInterop = {
    _bindings: [],

    initBindingsFromWindow: function () {
        if (window.designBindings) {
            this.initBindings(window.designBindings);
        } else {
            console.warn("No design bindings found in window.");
        }
    },

    initBindings: function (bindings) {
        this._bindings = bindings;
        console.log("Init bindings:", bindings);

        for (const binding of this._bindings) {
            this.applyBinding(binding, binding.value);
        }
    },

    receiveUpdates: function (updates) {
        console.log("Apply updates:", updates);

        for (const update of updates) {
            if (update.action !== -1) {
                console.warn("Skipping collection update for property:", update.property);
                continue;
            }

            const bindings = this._bindings.filter(b => b.property === update.property);
            if (bindings.length === 0) {
                console.warn("No bindings for property:", update.property);
            }

            for (const binding of bindings) {
                this.applyBinding(binding, update.value);
            }
        }
    },

    applyBinding: function (binding, value) {
        const el = document.getElementById(binding.id);
        if (!el) {
            console.warn("Element not found for binding:", binding.id);
            return;
        }

        switch (binding.action) {
            case "ClassSwitch":
                if (binding.map) {
                    for (const cls of Object.values(binding.map)) {
                        if (cls) el.classList.remove(cls);
                    }
                    const newCls = binding.map[value];
                    if (newCls) el.classList.add(newCls);
                }
                break;

            case "SetText":
                if (binding.filter) {
                    const target = el.querySelector(`.${binding.filter}`);
                    if (target) {
                        target.textContent = value ?? "";
                    } else {
                        console.warn("Filtered element not found:", binding.filter, "in", binding.id);
                    }
                } else {
                    el.textContent = value ?? "";
                }
                break;

            case "SetValue":
                el.value = value ?? "";
                break;

            default:
                console.warn("Unknown binding action:", binding.action);
                break;
        }
    },

    showDialog: function (id) {
        alert("Dialog: " + id);
    },

    showNotification: function (notif) {
        console.log("Notify: ", notif);
    }
};