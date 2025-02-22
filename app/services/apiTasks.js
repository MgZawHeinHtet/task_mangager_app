import axios from "axios";

export async function getTasks() {
  const res = await axios.get("http://localhost:8000/tasks");

  return res.data;
}

export async function deleteTask(id) {
  try {
    const res = await axios.delete(`http://localhost:8000/tasks/${id}`);

    return JSON.stringify(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function createTask(data) {
  try {
    const res = await axios.post(`http://localhost:8000/tasks`, data);
    return JSON.stringify(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function updateTask(data){
  try {
    const res = await axios.put(`http://localhost:8000/tasks/${data.id}`, data);
    return JSON.stringify(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function completeTask(data){
  try {
    const res = await axios.put(`http://localhost:8000/tasks/${data.id}`, data);
    return JSON.stringify(res.data);
  } catch (error) {
    console.log(error);
  }
}
