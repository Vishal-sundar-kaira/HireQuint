import React, { useEffect, useState } from 'react'
import logo from "./assets/logo.webp"
import "./Admin.css"
const Admin = () => {
  const [users,setusers]=useState([]);
  const[page,setpage]=useState(1);
  const[start,setstart]=useState(0);
  const[end,setend]=useState(9);
  const[prevdis,setprevdis]=useState(true);
  const[nextdis,setnextdis]=useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalUsers, setOriginalUsers] = useState([]);
  const[totalusers,settotalusers]=useState(46)
  //fetch api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
        if (!response.ok) {
          throw new Error("Network respond was not ok");
        }
        const data = await response.json();
        const mappedData = data.map(user => ({ ...user, editable: false }));
        setusers(mappedData);
        setOriginalUsers(mappedData);  // Initialize originalUsers with the fetched data
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
useEffect(()=>{
  const sum=users.length
  settotalusers(sum)
},[users])
  const increasetuple=()=>{
    setstart((page-1)*10);
    setend(((page-1)*10)+9);
    if(page>1){
      setprevdis(false);
    }
    else{
      setprevdis(true);
    }
    console.log(page);
    console.log(Math.ceil(users.length/10))
    if(page==(Math.ceil(users.length/10))){
      setnextdis(true);
    }
    else{
      setnextdis(false);
    }
  }
  useEffect(() => {
    increasetuple();
  }, [page, users]);

   const movenext=()=>{
    setpage(page+1);
   }
   const moveback=()=>{
    setpage(page-1);
   }
   const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    const originalusers=originalUsers.filter((user)=>user.id!=userId);
    setusers(updatedUsers);
    setOriginalUsers(originalusers);
  };
  
  const deleteSelectedRows = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    const originalusers = originalUsers.filter(user => !selectedRows.includes(user.id));
    setusers(updatedUsers);
    setOriginalUsers(originalusers);
    setSelectedRows([]);
  };
  
  const toggleSelectRow = (userId) => {
    if (selectedRows.includes(userId)) {
      setSelectedRows(prevSelectedRows => prevSelectedRows.filter(id => id !== userId));
    } else {
      setSelectedRows(prevSelectedRows => [...prevSelectedRows, userId]);
    }
  }
  const selectall = () => {
    const selectedRowsOnCurrentPage = [];
  
    for (let i = start; i <= end; i++) {
      const userId = users[i].id;
      selectedRowsOnCurrentPage.push(userId);
    }
  
    const allSelectedOnCurrentPage = selectedRowsOnCurrentPage.every((userId) =>
      selectedRows.includes(userId)
    );
  
    if (allSelectedOnCurrentPage) {
      // Deselect all rows on the current page
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => !selectedRowsOnCurrentPage.includes(id))
      );
    } else {
      // Select all rows on the current page
      setSelectedRows((prevSelectedRows) =>
        [...prevSelectedRows, ...selectedRowsOnCurrentPage]
      );
    }
  };
  
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === '') {
      setusers(originalUsers);
    } else {
      const filteredUsers = originalUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(trimmedQuery) ||
          user.email.toLowerCase().includes(trimmedQuery) ||
          user.role.toLowerCase().includes(trimmedQuery)
      );
      setusers(filteredUsers);
    }
  };
  
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleKeyDown = (e, userId) => {
    if (e.key === 'Enter') {
      handleSaveClick(userId);
    }
  };
  const handleEditClick = (userId) => {
    // Toggle the editable state for the selected row
    setusers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, editable: !user.editable } : user
      )
    );
  };

  const handleSaveClick = (userId) => {
    // Save the changes made in the editable fields
    setusers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, editable: false } : user
      )
    );
  };
  return (
    <div className='main'>
      <div className="dashboard">
        <div className="left">
          <div className="img">
            <img src={logo} alt="" />
          </div>
          <div className="leftrow">
            <div className="row" style={{backgroundColor:"#0a80a3"}}>
            <i class="fa-solid fa-chart-simple"></i>
              <h2>Dashboard</h2>
            </div>
            <div className="row">
            <i class="fa-solid fa-chart-line"></i>
              <h2>Product</h2>
            </div>
            <div className="row">
            <i class="fa-solid fa-house"></i>
              <h2>Solution</h2>
            </div>
            <div className="row">
            <i class="fa-solid fa-building"></i>
              <h2>Price</h2>
            </div>
            <div className="row">
            <i class="fa-solid fa-chart-line"></i>
              <h2>Modal</h2>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="right1">
            <div className="search">
              <div className="searchbar">
              <i class="fa-solid fa-magnifying-glass"></i>
              <div className='inputname'>
        <input type="text" placeholder='Enter value' value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}/>
        
    </div>
              </div>
              <div className="logout">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <i class="fa-regular fa-bell"></i>
              </div>
            </div>
          </div>
          <hr />
          <div className="right2">
            <div className="users">
              <div className="subuser">
              <i class="fa-solid fa-users"></i>
                <div className="totaluser">
                  <h2>Users</h2>
                  <h2>{totalusers}</h2>
                </div>
              </div>
            </div>
            <div className="alldelete">
            <i className="fa-solid fa-trash" style={{cursor:"pointer"}} onClick={deleteSelectedRows}></i>
            </div>
          </div>
          <div className="right3">
          <table>
        <thead>
            <tr>
              <th>
              <td style={{padding:"0px",display:"flex",justifyContent:"center"}}> 
              <input
                type="checkbox"
                onClick={selectall}
                style={{cursor:"pointer"}}
                checked={users.slice(start, end + 1).every((user) => selectedRows.includes(user.id))}

            />

              </td>
              </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
           { users.slice(start,end).map((user)=>(
                       <tr
                       key={user.id}
                       style={{
                         backgroundColor: selectedRows.includes(user.id)
                           ? '#CCCCCC'
                           : 'transparent',
                       }}
                     >
                       <td style={{ padding: '0px' }}>
                         <input
                           type="checkbox"
                           style={{cursor:"pointer"}}
                           checked={selectedRows.includes(user.id)}
                           onChange={() => toggleSelectRow(user.id)}
                         />
                       </td>
                       <td >
                         {user.editable ? (
                           <input
                             type="text"
                             value={user.name}
                             onKeyDown={(e) => handleKeyDown(e, user.id)}
                             onChange={(e) =>
                               setusers((prevUsers) =>
                                 prevUsers.map((u) =>
                                   u.id === user.id ? { ...u, name: e.target.value } : u
                                 )
                               )
                             }
                           />
                         ) : (
                           user.name
                         )}
                       </td>
                       <td>
                         {user.editable ? (
                           <input
                             type="text"
                             value={user.email}
                             onKeyDown={(e) => handleKeyDown(e, user.id)}
                             onChange={(e) =>
                               setusers((prevUsers) =>
                                 prevUsers.map((u) =>
                                   u.id === user.id ? { ...u, email: e.target.value } : u
                                 )
                               )
                             }
                           />
                         ) : (
                           user.email
                         )}
                       </td>
                       <td >
                         {user.editable ? (
                           <input
                             type="text"
                             value={user.role}
                             onKeyDown={(e) => handleKeyDown(e, user.id)}
                             onChange={(e) =>
                               setusers((prevUsers) =>
                                 prevUsers.map((u) =>
                                   u.id === user.id ? { ...u, role: e.target.value } : u
                                 )
                               )
                             }
                           />
                         ) : (
                           user.role
                         )}
                       </td>
                       <td >
                         <div className="actions">
                           <i
                             className="fa-solid fa-pen-to-square"
                             onClick={() => handleEditClick(user.id)}
                           ></i>
                           <i
                             className="fa-solid fa-trash"
                             onClick={() => {
                               deleteUser(user.id);
                             }}
                           ></i>
                           {/* {user.editable && (
                             <button onClick={() => handleSaveClick(user.id)}>Save</button>
                           )} */}
                         </div>
                       </td>
                     </tr>
           ))}
        </tbody>
      </table>
          </div>
          <div className="containums">
      <button onClick={()=>{moveback()}} disabled={prevdis}>Prev</button>
      <div className="numbers">
          {(() => {
            const result = [];
            for (let val = 1; val <=Math.ceil(users.length/10); val++) {
              result.push(
                <div onClick={()=>{setpage(val)}} key={val} className="num" value={val}>
                  {val}
                </div>
              );
            }
            return result;
          })()}
      </div>
      <button onClick={()=>{movenext()}} disabled={nextdis}>Next</button>
      </div>
        </div>
      </div>
      
    </div>
  )
}

export default Admin
