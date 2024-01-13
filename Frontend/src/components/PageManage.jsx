import { useState } from "react";

const PageManage = (props) => {

  const baseURL = 'http://localhost:8081';

  const [addData, setAddData] = useState({
    addNumber: '',
    pageIndex: ''
  });
  const [deleteData, setDeleteData] = useState({
    pageNumbers: []
  });
  const [reorderData, setReorderData] = useState({
    source: '',
    dest: ''
  });

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${baseURL}/pages/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addData)
      })
        .then(response => response.json())
        .then(data => props.onData(data))
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const handleSubmitDelete = async (e) => {
    e.preventDefault();
    console.log("deleteData: ", deleteData);
    try {
      await fetch(`${baseURL}/pages/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteData)
      })
        .then(response => response.json())
        .then(data => props.onData(data))
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const handleSubmitReorder = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${baseURL}/pages/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reorderData)
      })
        .then(response => response.json())
        .then(data => props.onData(data))
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const handleChangeAdd = (e) => {
    setAddData({
      ...addData,
      [e.target.name]: e.target.value
    });
  }
  const handleChangeDelete = (e) => {
    const string = e.target.value;
    const array = string.split(",").map(Number);
    console.log("array: ", array);
    setDeleteData({
      ...deleteData,
      [e.target.name]: array
    });
  }
  const handleChangeReorder = (e) => {
    setReorderData({
      ...reorderData,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="page-manage p-3 d-flex flex-column justify-content-center" style={{ width: '500px' }}>
      <form className="add-pages w-100 m-1 d-flex justify-content-between" onSubmit={handleSubmitAdd}>
        <div>
          <span>I want to add</span>
          <span>
            <input
              name="addNumber"
              type="number"
              min={1}
              max={9999}
              className="p-0 pl-1 mx-2"
              onChange={handleChangeAdd}
            />
          </span>
          <span>pages after</span>
          <span>
            <input
              name="pageIndex"
              type="number"
              min={1}
              max={9999}
              className="p-0 pl-1 mx-2"
              onChange={handleChangeAdd}
            />
          </span>
          <span>page.</span>
        </div>
        <button type="submit"><i className="fas fa-check-double fa-lg"></i></button>
      </form>
      <form className="delete-pages w-100 m-1 d-flex justify-content-between" onSubmit={handleSubmitDelete}>
        <div>
          <span>I want to delete pages - </span>
          <span>
            <input
              name="pageNumbers"
              type="text"
              min={1}
              max={9999}
              placeholder="2,3,1"
              className="p-0 pl-1 mx-2"
              onChange={handleChangeDelete}
            />
          </span>
        </div>
        <button type="submit"><i className="fas fa-check-double fa-lg"></i></button>
      </form>
      <form className="reorder-pages w-100 m-1 d-flex justify-content-between" onSubmit={handleSubmitReorder}>
        <span>I want to move page - </span>
        <span>
          <input
            name="source"
            type="number"
            min={1}
            max={9999}
            className="p-0 pl-1 mx-2"
            onChange={handleChangeReorder}
          />
        </span>
        <span>to page</span>
        <span>
          <input
            name="dest"
            type="number"
            min={1}
            max={9999}
            className="p-0 pl-1 mx-2"
            onChange={handleChangeReorder}
          />
        </span>
        <button type="submit"><i className="fas fa-check-double fa-lg"></i></button>
      </form>
    </div>
  )
}

export default PageManage;