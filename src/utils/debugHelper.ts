// Kiểm tra Redux state
export const debugReduxState = (state: any) => {
  console.log("=== REDUX STATE DEBUG ===");
  console.log("Lists:", state.lists);
  console.log("Tasks:", state.tasks);
  console.log("Tags:", state.tags);
};

// Kiểm tra API connection
export const debugAPIConnection = async () => {
  try {
    console.log("🔍 Kiểm tra API connections...");

    const listsRes = await fetch("http://localhost:3001/lists");
    const listData = await listsRes.json();
    console.log("✅ Lists API:", listData);

    const tasksRes = await fetch("http://localhost:3001/tasks");
    const taskData = await tasksRes.json();
    console.log("✅ Tasks API:", taskData);

    const tagsRes = await fetch("http://localhost:3001/tags");
    const tagData = await tagsRes.json();
    console.log("✅ Tags API:", tagData);

    return { lists: listData, tasks: taskData, tags: tagData };
  } catch (error) {
    console.error("❌ API Connection Error:", error);
    return null;
  }
};

// Hook để debug trong component
export const useDebugState = (state: any, name: string = "State") => {
  console.log(`🔍 [${name}]`, state);
};

// Format console output
export const logSection = (title: string) => {
  console.log(`\n${"=".repeat(40)}`);
  console.log(`  ${title}`);
  console.log(`${"=".repeat(40)}\n`);
};