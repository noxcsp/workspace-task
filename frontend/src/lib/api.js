const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetch all tasks.
 */
export async function fetchTasks() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch tasks');
  }
  const result = await response.json();
  return result.data || [];
}

/**
 * Create a new task.
 */
export async function createTask(taskData) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create task');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Update an existing task.
 */
export async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update task');
  }
  const result = await response.json();
  return result.data;
}

/**
 * Delete a task.
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete task');
  }
  const result = await response.json();
  return result.success;
}
