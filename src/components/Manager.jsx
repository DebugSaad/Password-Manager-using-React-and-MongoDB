import React from "react";
import { useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);

  const getPasswords = async() => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    setpasswordArray(passwords);

  }
  

  useEffect(() => {
    getPasswords();

  }, []);

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("icons/eyecross.png")) {
      ref.current.src = "icons/eye.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if(form.site.length > 3 && form.username.length > 3 && form.password.length > 3){
      setpasswordArray([...passwordArray, {...form, id: uuidv4()}]);

      await fetch("http://localhost:3000/", {method: "DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify([...passwordArray, {id: form.id}])})

      await fetch("http://localhost:3000/", {method: "POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify([...passwordArray, {...form, id: uuidv4()}])})
      // localStorage.setItem("password", JSON.stringify([...passwordArray, {...form, id: uuidv4()}]));
      setform({ site: "", username: "", password: "" });
    }
    else{
      alert("Password not saved");
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const deletePassword = async (id) => {
    let c = confirm("Do you really want to delete this password ?")
    if(c){

      setpasswordArray(passwordArray.filter(item => item.id !== id));
      // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)));
      let res = await fetch("http://localhost:3000/", {method: "DELETE", headers:{"Content-Type":"application/json"}, body: JSON.stringify([...passwordArray, {id}])})
    }
  }
  const editPassword = (id) => {

    console.log("Editing item of id ",id)
    setform({...passwordArray.filter(i => i.id === id)[0], id:id});
    setpasswordArray(passwordArray.filter(item => item.id !== id));
  }
  

  return (
    <>

      {/* Same as */}


      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="p-2 md:p-4 md:mycontainer">
        <h1 className="text-4xl  font-bold text-center w-full">
          <span className="text-green-700">&lt;</span>
          <span className="text-slate-800">Pass</span>
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center w-full">
          Your own password manager
        </p>
        <div className="text-black flex flex-col p-4  gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 outline-none p-4 py-1 w-full text-black"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-between gap-8 ">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 outline-none p-4 py-1 w-full text-black"
              type="text"
              name="username"
              id="username"
            />
            <div className="relative">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 outline-none p-4 py-1 w-full text-black"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="absolute right-[5px] top-[9px] cursor-pointer "
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="w-4"
                  src="icons/eyecross.png"
                  alt="Show"
                />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className=" text-white font-semibold flex justify-center items-center gap-1 bg-green-500 rounded-full px-4 py-2 w-fit hover:bg-green-400 border border-green-800 transition-all"
          >
            <lord-icon
              src="https://cdn.lordicon.com/pdsourfn.json"
              trigger="hover"
              stroke="light"
            ></lord-icon>
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-xl py-4 text-green-800">
            Your Passwords
          </h2>
          {passwordArray.length === 0 && <div>No Passwords to show.</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className=" bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className=" text-center py-2 ">
                        <div className="flex items-center justify-center">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <div
                            className="size-7 cursor-pointer lordiconcopy"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2">
                        <div className="flex items-center justify-center">
                          <span>{item.username}</span>
                          <div
                            className="size-7 cursor-pointer lordiconcopy"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2">
                        <div className="flex items-center justify-center">
                          <span>{item.password}</span>
                          <div
                            className="size-7 cursor-pointer lordiconcopy"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/iykgtsbt.json"
                              trigger="hover"
                              style={{
                                width: "25px",
                                height: "25px",
                                paddingTop: "3px",
                                paddingLeft: "3px",
                              }}
                            ></lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 ">
                          <span>
                          <lord-icon className="cursor-pointer mx-2" onClick ={()=>{editPassword(item.id)}}
                              src="https://cdn.lordicon.com/gwlusjdu.json"
                              trigger="hover"
                              style={{
                                "height":"25px",
                                "widht":"25px"
                              }}
                            ></lord-icon>
                          <lord-icon className="cursor-pointer mx-2" onClick ={()=>{deletePassword(item.id)}}
                              src="https://cdn.lordicon.com/skkahier.json"
                              trigger="hover"
                              style={{
                                "height":"25px",
                                "widht":"25px"
                              }}
                            ></lord-icon>
                          </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
