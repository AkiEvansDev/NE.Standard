// wwwroot/js/src/app.ts
var eventMap = /* @__PURE__ */ new WeakMap();
var dotNetHelper = null;
var ne = {
  initInterop: async (helper) => {
    dotNetHelper = helper;
    return true;
  },
  set: async (data) => {
    try {
      data.forEach(({ key: value, value: ids }) => {
        ids.forEach((id) => {
          const element = document.getElementById(id);
          if (!element) {
            console.warn(`Element with id="${id}" not found`);
            return;
          }
          if ("value" in element) {
            element.value = value;
          } else {
            element.textContent = value;
          }
        });
      });
      return true;
    } catch (error) {
      console.error("Update set error:", error);
      return false;
    }
  },
  updateEvents: async (id) => {
    try {
      if (!dotNetHelper) {
        console.error("Interop not initialized. Call initInterop first.");
        return false;
      }
      const container = document.getElementById(id);
      if (!container) {
        console.warn(`Container with id "${id}" not found.`);
        return false;
      }
      const buttons = container.querySelectorAll("button[data-action]");
      buttons.forEach((button) => {
        const oldHandler = eventMap.get(button);
        if (oldHandler) {
          button.removeEventListener("click", oldHandler);
        }
        const handler = async () => {
          const action = button.getAttribute("data-action");
          const rawParams = button.getAttribute("data-params");
          if (!action) {
            console.warn("Missing data-action");
            return;
          }
          let params = [];
          try {
            params = rawParams ? JSON.parse(rawParams) : [];
          } catch (e) {
            console.error("Invalid JSON in data-params:", e);
          }
          try {
            const result = await dotNetHelper.invokeMethodAsync(
              "HandleAction",
              action,
              params
            );
            if (result.success) {
              console.log(`Action '${action}' executed successfully.`);
            } else {
              console.warn(`Action '${action}' failed:`, result.error);
            }
          } catch (err) {
            console.error(`Failed to call C# method:`, err);
          }
        };
        button.addEventListener("click", handler);
        eventMap.set(button, handler);
      });
      return true;
    } catch (error) {
      console.error("Update set error:", error);
      return false;
    }
  }
};
window.ne = ne;
