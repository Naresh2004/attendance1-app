// import React,{useState,useEffect} from "react"
// import "../Auth.css"

// // 📊 CHART
// import {Bar} from "react-chartjs-2"
// import {
// Chart as ChartJS,
// CategoryScale,
// LinearScale,
// BarElement,
// Tooltip,
// Legend
// } from "chart.js"

// ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend)

// // 📤 EXCEL
// import * as XLSX from "xlsx"
// import {saveAs} from "file-saver"

// export default function Dashboard({setPage}){

// const [students,setStudents]=useState({})
// const [name,setName]=useState("")
// const [roll,setRoll]=useState("")
// const [photo,setPhoto]=useState(null)
// const [activeStudent,setActiveStudent]=useState(null)

// const [currentDate,setCurrentDate]=useState(new Date())

// // ================= LOAD =================
// useEffect(()=>{
// const stored=localStorage.getItem("studentData")
// if(stored){
// setStudents(JSON.parse(stored))
// }
// },[])

// const saveData=(data)=>{
// setStudents(data)
// localStorage.setItem("studentData",JSON.stringify(data))
// }

// // ================= ADD =================
// const addStudent=()=>{

// if(!name || !roll){
// alert("Enter name & roll")
// return
// }

// const id="student-"+Date.now()

// const newStudent={
// id,
// name,
// roll,
// photo,
// attendance:{}
// }

// const updated={...students,[id]:newStudent}

// saveData(updated)
// setActiveStudent(id)

// setName("")
// setRoll("")
// setPhoto(null)
// }

// // ================= DELETE =================
// const deleteStudent=(id)=>{
// const updated={...students}
// delete updated[id]
// saveData(updated)
// setActiveStudent(null)
// }

// // ================= DATE =================
// const year=currentDate.getFullYear()
// const month=currentDate.getMonth()
// const monthKey=`${year}-${month}`

// // ================= MARK =================
// const markAttendance=(day)=>{

// if(!activeStudent) return

// const updated={...students}
// const s={...updated[activeStudent]}

// s.attendance={...s.attendance}

// if(!s.attendance[monthKey]){
// s.attendance[monthKey]={}
// }

// const current=s.attendance[monthKey][day]

// if(!current) s.attendance[monthKey][day]="present"
// else if(current==="present") s.attendance[monthKey][day]="absent"
// else if(current==="absent") s.attendance[monthKey][day]="half"
// else delete s.attendance[monthKey][day]

// updated[activeStudent]=s
// saveData(updated)
// }

// // ================= MONTH =================
// const changeMonth=(offset)=>{
// const d=new Date(currentDate)
// d.setMonth(d.getMonth()+offset)
// setCurrentDate(d)
// }

// // ================= LOGOUT =================
// const logout=()=>{
// localStorage.removeItem("token")
// setPage("login")
// }

// // ================= CALENDAR =================
// const firstDay=new Date(year,month,1).getDay()
// const daysInMonth=new Date(year,month+1,0).getDate()

// const calendarDays=[]
// for(let i=0;i<firstDay;i++) calendarDays.push(null)
// for(let i=1;i<=daysInMonth;i++) calendarDays.push(i)

// const weeks=[]
// for(let i=0;i<calendarDays.length;i+=7){
// weeks.push(calendarDays.slice(i,i+7))
// }

// const s=activeStudent ? students[activeStudent] : null

// // ================= MONTHLY =================
// let present=0,absent=0,half=0

// const monthData=s?.attendance?.[monthKey] || {}

// Object.values(monthData).forEach(a=>{
// if(a==="present") present++
// if(a==="absent") absent++
// if(a==="half") half++
// })

// const total=present+absent+half
// const monthlyPercent=total?((present+half*0.5)/total*100).toFixed(1):0

// // ================= TOTAL =================
// let totalP=0,totalA=0,totalH=0

// Object.values(s?.attendance || {}).forEach(m=>{
// Object.values(m).forEach(a=>{
// if(a==="present") totalP++
// if(a==="absent") totalA++
// if(a==="half") totalH++
// })
// })

// const totalAll=totalP+totalA+totalH
// const totalPercent=totalAll?((totalP+totalH*0.5)/totalAll*100).toFixed(1):0

// // ================= CHART =================
// const chartData={
// labels:["Present","Absent","Half"],
// datasets:[
// {
// label:"Attendance",
// data:[present,absent,half],
// backgroundColor:[
// "#28a745", // green
// "#dc3545", // red
// "#fd7e14"  // orange
// ],
// borderRadius:6
// }
// ]
// }

// // ================= EXCEL =================
// const exportExcel=()=>{

// if(!s) return

// const rows=[]

// Object.keys(s.attendance).forEach(mKey=>{

// const [y,m]=mKey.split("-")
// const month=parseInt(m)+1

// Object.keys(s.attendance[mKey]).forEach(day=>{

// const status=s.attendance[mKey][day]
// if(!status) return

// const fullDate=`${y}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`

// rows.push([
// s.name,
// fullDate,
// status.toUpperCase()
// ])

// })

// })

// // summary
// rows.push([])
// rows.push(["SUMMARY"])
// rows.push(["Present",totalP])
// rows.push(["Absent",totalA])
// rows.push(["Half Day",totalH])
// rows.push(["Total %",totalPercent+"%"])

// // sheet
// const ws=XLSX.utils.aoa_to_sheet([
// ["Student","Date","Status"],
// ...rows
// ])

// const wb=XLSX.utils.book_new()
// XLSX.utils.book_append_sheet(wb,ws,"Attendance")

// const buffer=XLSX.write(wb,{bookType:"xlsx",type:"array"})
// saveAs(new Blob([buffer]),`${s.name}_Attendance.xlsx`)
// }

// // ================= UI =================
// return(

// <div className="auth-container">

// {/* MAIN */}
// {!activeStudent && (
// <>
// <div className="auth-card">

// <h2>🎓 Self Attendance App</h2>

// <input
// placeholder="Student Name"
// value={name}
// onChange={(e)=>{
// const val=e.target.value
// if(/^[a-zA-Z\s]*$/.test(val)){
// setName(val)
// }
// }}
// />

// <input
// placeholder="Roll Number"
// value={roll}
// onChange={(e)=>{
// const val=e.target.value
// if(/^[0-9]*$/.test(val)){
// setRoll(val)
// }
// }}
// />

// <input type="file" onChange={(e)=>{
// const file=e.target.files[0]
// if(!file) return
// const reader=new FileReader()
// reader.onload=()=>setPhoto(reader.result)
// reader.readAsDataURL(file)
// }}/>

// <button onClick={addStudent}>➕ Add Student</button>
// <button onClick={logout}>🚪 Logout</button>

// </div>

// <div className="saved-list">
// <h4>📋 Saved Students</h4>
// {Object.values(students).map((stu)=>(
// <button key={stu.id} onClick={()=>setActiveStudent(stu.id)}>
// {stu.name} ({stu.roll})
// </button>
// ))}
// </div>
// </>
// )}

// {/* CALENDAR */}
// {activeStudent && s && (

// <div className="student-calendar">

// <button onClick={()=>setActiveStudent(null)}>⬅ Back</button>

// <h3>{s.name} ({s.roll})</h3>

// {s.photo && (
// <img src={s.photo} style={{width:"100px",borderRadius:"10px"}}/>
// )}

// <div>
// <button onClick={()=>changeMonth(-1)}>⬅</button>

// <h3>
// {currentDate.toLocaleString('default',{month:'long'})} {year}
// </h3>

// <button onClick={()=>changeMonth(1)}>➡</button>
// </div>

// <table>
// <thead>
// <tr>
// <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
// <th>Thu</th><th>Fri</th><th>Sat</th>
// </tr>
// </thead>

// <tbody>
// {weeks.map((week,i)=>(
// <tr key={i}>
// {week.map((day,j)=>{

// if(!day) return <td key={j}></td>

// const status=s.attendance?.[monthKey]?.[day]

// return(
// <td key={j} className={status} onClick={()=>markAttendance(day)}>
// {day}
// </td>
// )

// })}
// </tr>
// ))}
// </tbody>
// </table>

// <h4>📊 Monthly: {monthlyPercent}%</h4>
// <h4>📈 Total: {totalPercent}%</h4>

// <div style={{width:"280px",margin:"auto"}}>
// <Bar data={chartData}/>
// </div>

// <button onClick={exportExcel}>📤 Export Excel</button>

// <button className="delete-btn" onClick={()=>deleteStudent(s.id)}>
// ❌ Delete Student
// </button>

// </div>

// )}

// </div>

// )

// }




import React,{useState,useEffect} from "react"
import axios from "axios"
import "../Auth.css"

// 📊 CHART
import {Bar} from "react-chartjs-2"
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Tooltip,
Legend
} from "chart.js"

ChartJS.register(CategoryScale,LinearScale,BarElement,Tooltip,Legend)

// 📤 EXCEL
import * as XLSX from "xlsx"
import {saveAs} from "file-saver"

const API="https://attendance-backend-lghd.onrender.com/api"

export default function Dashboard({setPage}){

const [students,setStudents]=useState([])
const [name,setName]=useState("")
const [mobile,setMobile]=useState("")
const [file,setFile]=useState(null)

const [activeStudent,setActiveStudent]=useState(null)
const [attendance,setAttendance]=useState([])

const [currentDate,setCurrentDate]=useState(new Date())

// ================= LOAD STUDENTS =================
const loadStudents=async()=>{
try{
const res=await axios.get(`${API}/students`)
setStudents(res.data)
}catch{
console.log("Load failed")
}
}

useEffect(()=>{
loadStudents()
},[])

// ================= LOAD ATTENDANCE =================
const loadAttendance=async(id)=>{
try{
const res=await axios.get(`${API}/attendance/${id}`)
setAttendance(res.data)
}catch{
console.log("Attendance load failed")
}
}

// ================= ADD STUDENT =================
const addStudent=async()=>{
if(!name || !mobile){
alert("Enter name & mobile")
return
}

try{
const formData=new FormData()
formData.append("name",name)
formData.append("mobile",mobile)
if(file) formData.append("image",file)

await axios.post(`${API}/students`,formData)

setName("")
setMobile("")
setFile(null)

loadStudents()

}catch{
alert("Add failed")
}
}

// ================= DELETE =================
const deleteStudent=async(id)=>{
await axios.delete(`${API}/students/${id}`)
loadStudents()
setActiveStudent(null)
}

// ================= MARK ATTENDANCE =================
const markAttendance=async(day)=>{

if(!activeStudent) return

const date=`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${day}`

try{
await axios.post(`${API}/attendance`,{
studentId:activeStudent._id,
date,
status:"Present"
})

loadAttendance(activeStudent._id)

}catch{
alert("Attendance failed")
}

}

// ================= MONTH =================
const year=currentDate.getFullYear()
const month=currentDate.getMonth()

const daysInMonth=new Date(year,month+1,0).getDate()

// ================= COUNT =================
let present=attendance.filter(a=>a.status==="Present").length

const total=attendance.length
const percent=total?((present/total)*100).toFixed(1):0

// ================= CHART =================
const chartData={
labels:["Present","Absent"],
datasets:[
{
label:"Attendance",
data:[present,total-present]
}
]
}

// ================= EXCEL =================
const exportExcel=()=>{

const rows=attendance.map(a=>[
activeStudent.name,
a.date,
a.status
])

const ws=XLSX.utils.aoa_to_sheet([
["Name","Date","Status"],
...rows
])

const wb=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb,ws,"Attendance")

const buffer=XLSX.write(wb,{bookType:"xlsx",type:"array"})
saveAs(new Blob([buffer]),`${activeStudent.name}.xlsx`)
}

// ================= LOGOUT =================
const logout=()=>{
localStorage.removeItem("token")
setPage("login")
}

// ================= UI =================
return(

<div className="auth-container">

{/* ADD */}
<div className="auth-card">

<h2>🎓 Attendance Dashboard</h2>

<input
placeholder="Student Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Mobile"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<input type="file" onChange={(e)=>setFile(e.target.files[0])}/>

<button onClick={addStudent}>➕ Add Student</button>
<button onClick={logout}>🚪 Logout</button>

</div>

{/* LIST */}
<div className="saved-list">

<h3>📋 Students</h3>

{students.map((s)=>(
<div key={s._id}>

<h4 onClick={()=>{
setActiveStudent(s)
loadAttendance(s._id)
}}>
{s.name}
</h4>

<button onClick={()=>deleteStudent(s._id)}>❌</button>

</div>
))}

</div>

{/* ATTENDANCE */}
{activeStudent && (

<div className="student-calendar">

<h3>{activeStudent.name}</h3>

<div>
<button onClick={()=>setCurrentDate(new Date(year,month-1))}>⬅</button>
<button onClick={()=>setCurrentDate(new Date(year,month+1))}>➡</button>
</div>

<div className="calendar-grid">

{[...Array(daysInMonth)].map((_,i)=>(
<button key={i} onClick={()=>markAttendance(i+1)}>
{i+1}
</button>
))}

</div>

<h4>📊 Attendance: {percent}%</h4>

<div style={{width:"300px"}}>
<Bar data={chartData}/>
</div>

<button onClick={exportExcel}>📤 Export Excel</button>

</div>

)}

</div>

)
}
