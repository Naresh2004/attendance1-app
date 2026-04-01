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
import "../Auth.css"

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

import * as XLSX from "xlsx"
import {saveAs} from "file-saver"

export default function Dashboard({setPage}){

const [students,setStudents]=useState([])
const [name,setName]=useState("")
const [roll,setRoll]=useState("")
const [photo,setPhoto]=useState(null)
const [activeStudent,setActiveStudent]=useState(null)

const [currentDate,setCurrentDate]=useState(new Date())

// ================= LOAD =================
useEffect(()=>{
const stored=localStorage.getItem("studentData")

if(stored){
const parsed = JSON.parse(stored)
setStudents(Object.values(parsed))
}
},[])

// ================= SAVE =================
const saveData=(list)=>{
setStudents(list)

const obj = Object.fromEntries(list.map(s=>[s.id,s]))
localStorage.setItem("studentData",JSON.stringify(obj))
}

// ================= ADD =================
const addStudent=()=>{

if(!name || !roll){
alert("Enter name & roll")
return
}

const newStudent={
id:"student-"+Date.now(),
name,
roll,
photo,
attendance:{}
}

const updated=[...students,newStudent]

saveData(updated)
setActiveStudent(newStudent.id)

setName("")
setRoll("")
setPhoto(null)
}

// ================= DELETE =================
const deleteStudent=(id)=>{
const updated=students.filter(s=>s.id!==id)
saveData(updated)
setActiveStudent(null)
}

// ================= DATE =================
const year=currentDate.getFullYear()
const month=currentDate.getMonth()
const monthKey=`${year}-${month}`

// ================= MARK =================
const markAttendance=(day)=>{

if(!activeStudent) return

const updated=students.map(stu=>{

if(stu.id!==activeStudent) return stu

let attendance={...stu.attendance}

if(!attendance[monthKey]) attendance[monthKey]={}

const current=attendance[monthKey][day]

if(!current) attendance[monthKey][day]="present"
else if(current==="present") attendance[monthKey][day]="absent"
else if(current==="absent") attendance[monthKey][day]="half"
else delete attendance[monthKey][day]

return {...stu,attendance}

})

saveData(updated)
}

// ================= MONTH =================
const changeMonth=(offset)=>{
const d=new Date(currentDate)
d.setMonth(d.getMonth()+offset)
setCurrentDate(d)
}

// ================= LOGOUT =================
const logout=()=>{
localStorage.removeItem("token")
setPage("login")
}

// ================= ACTIVE STUDENT =================
const s = students.find(stu=>stu.id===activeStudent)

// ================= CALENDAR =================
const firstDay=new Date(year,month,1).getDay()
const daysInMonth=new Date(year,month+1,0).getDate()

const calendarDays=[]
for(let i=0;i<firstDay;i++) calendarDays.push(null)
for(let i=1;i<=daysInMonth;i++) calendarDays.push(i)

const weeks=[]
for(let i=0;i<calendarDays.length;i+=7){
weeks.push(calendarDays.slice(i,i+7))
}

// ================= MONTHLY =================
let present=0,absent=0,half=0

const monthData=s?.attendance?.[monthKey] || {}

Object.values(monthData).forEach(a=>{
if(a==="present") present++
if(a==="absent") absent++
if(a==="half") half++
})

const total=present+absent+half
const monthlyPercent=total?((present+half*0.5)/total*100).toFixed(1):0

// ================= TOTAL =================
let totalP=0,totalA=0,totalH=0

Object.values(s?.attendance || {}).forEach(m=>{
Object.values(m).forEach(a=>{
if(a==="present") totalP++
if(a==="absent") totalA++
if(a==="half") totalH++
})
})

const totalAll=totalP+totalA+totalH
const totalPercent=totalAll?((totalP+totalH*0.5)/totalAll*100).toFixed(1):0

// ================= CHART =================
const chartData={
labels:["Present","Absent","Half"],
datasets:[{
label:"Attendance",
data:[present,absent,half]
}]
}

// ================= EXCEL =================
const exportExcel=()=>{

if(!s) return

const rows=[]

Object.keys(s.attendance || {}).forEach(mKey=>{
const [y,m]=mKey.split("-")
const month=parseInt(m)+1

Object.keys(s.attendance[mKey]).forEach(day=>{
const status=s.attendance[mKey][day]
if(!status) return

const fullDate=`${y}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`

rows.push([s.name,fullDate,status.toUpperCase()])
})
})

const ws=XLSX.utils.aoa_to_sheet([["Student","Date","Status"],...rows])

const wb=XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb,ws,"Attendance")

const buffer=XLSX.write(wb,{bookType:"xlsx",type:"array"})
saveAs(new Blob([buffer]),`${s.name}.xlsx`)
}

// ================= UI =================
return(

<div className="auth-container">

{/* HOME */}
{!activeStudent && (
<>

<div className="auth-card">

<h2>🎓 Attendance Dashboard</h2>

<input placeholder="Student Name" value={name} onChange={(e)=>setName(e.target.value)}/>
<input placeholder="Roll Number" value={roll} onChange={(e)=>setRoll(e.target.value)}/>

<input type="file" onChange={(e)=>{
const file=e.target.files[0]
if(!file) return
const reader=new FileReader()
reader.onload=()=>setPhoto(reader.result)
reader.readAsDataURL(file)
}}/>

<button onClick={addStudent}>➕ Add Student</button>
<button onClick={logout}>🚪 Logout</button>

</div>

<div className="saved-list">
<h4>📋 Saved Students</h4>

{students.length===0 && <p>No students yet</p>}

{students.map((stu)=>(
<button key={stu.id} onClick={()=>setActiveStudent(stu.id)}>
{stu.name} ({stu.roll})
</button>
))}

</div>

</>
)}

{/* CALENDAR */}
{activeStudent && s && (

<div className="student-calendar">

<button onClick={()=>setActiveStudent(null)}>⬅ Back</button>

<h3>{s.name} ({s.roll})</h3>

{s.photo && <img src={s.photo} style={{width:"100px",borderRadius:"10px"}}/>}

<div>
<button onClick={()=>changeMonth(-1)}>⬅</button>
<h3>{currentDate.toLocaleString('default',{month:'long'})} {year}</h3>
<button onClick={()=>changeMonth(1)}>➡</button>
</div>

<table>
<thead>
<tr>
<th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th>
<th>Thu</th><th>Fri</th><th>Sat</th>
</tr>
</thead>

<tbody>
{weeks.map((week,i)=>(
<tr key={i}>
{week.map((day,j)=>{
if(!day) return <td key={j}></td>

const status=s.attendance?.[monthKey]?.[day]

return(
<td key={j} className={status} onClick={()=>markAttendance(day)}>
{day}
</td>
)
})}
</tr>
))}
</tbody>
</table>

<h4>📊 Monthly: {monthlyPercent}%</h4>
<h4>📈 Total: {totalPercent}%</h4>

<div style={{width:"280px",margin:"auto"}}>
<Bar data={chartData}/>
</div>

<button onClick={exportExcel}>📤 Export Excel</button>

<button className="delete-btn" onClick={()=>deleteStudent(s.id)}>
❌ Delete Student
</button>

</div>

)}

</div>

)
}