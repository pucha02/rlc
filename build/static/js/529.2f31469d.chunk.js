"use strict";(self.webpackChunkrlc=self.webpackChunkrlc||[]).push([[529],{9529:(e,t,s)=>{s.r(t),s.d(t,{default:()=>i});var a=s(5043),n=s(6213),l=s(3216),o=s(7017),r=s(579);const i=function(){const[e,t]=(0,a.useState)({d:"",allSlots:0,workTime:[]}),s=(0,l.Zp)(),i=(0,l.zy)(),{booking:m}=i.state||{},{lang:c}=i.state||{},{level:d}=i.state||{},{teacherId:u}=i.state||{},{lessonTypes:h}=i.state||{},{schoolId:p}=i.state||{};return(0,r.jsx)(o.A,{booking:e,handleChange:(s,a)=>{const{name:n,value:l}=s.target;if(null!==a){const s=[...e.workTime];s[a]={...s[a],[n]:l},t({...e,workTime:s})}else t({...e,[n]:l})},handleAddWorkTime:()=>{t({...e,workTime:[...e.workTime,{time:e.d,slots:0}]})},handleRemoveWorkTime:s=>{const a=e.workTime.filter(((e,t)=>t!==s));t({...e,workTime:a})},handleSubmit:async t=>{t.preventDefault();const a={...e,lang:c,levelName:d,lessonTypes:h};try{const e=`http://13.60.221.226/api/schools/${p}/teachers/${u}/dateses`;console.log("Submitting booking:",a);const t=await n.A.put(e,a);console.log("Server response:",t.data),s(`/${p}/admin`)}catch(l){console.error("Error saving booking:",l),l.response&&console.error("Response data:",l.response.data)}}})}},7017:(e,t,s)=>{s.d(t,{A:()=>n});s(5043);var a=s(579);const n=function(e){let{booking:t,handleChange:s,handleAddWorkTime:n,handleRemoveWorkTime:l,handleSubmit:o,id:r}=e;const i=e=>{if(!e)return"";const t=new Date(e);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}T${String(t.getHours()).padStart(2,"0")}:${String(t.getMinutes()).padStart(2,"0")}`};return(0,a.jsxs)("div",{className:"booking-form-container",children:[(0,a.jsx)("h1",{className:"form-title",children:r?"Edit Booking":"Create Booking"}),(0,a.jsxs)("form",{onSubmit:o,className:"booking-form",children:[(0,a.jsxs)("label",{className:"form-label",children:["Date:",(0,a.jsx)("input",{className:"form-input",type:"date",name:"d",value:t.d?t.d.split("T")[0]:"",onChange:e=>s(e,null),required:!0})]}),(0,a.jsxs)("label",{className:"form-label",children:["All Number:",(0,a.jsx)("input",{className:"form-input",type:"number",name:"allSlots",value:t.allSlots||0,onChange:e=>s(e,null),required:!0})]}),(0,a.jsxs)("div",{className:"worktime-section",children:[(0,a.jsx)("h2",{className:"worktime-title",children:"Work Times"}),t.workTime&&t.workTime.map(((e,t)=>(0,a.jsxs)("div",{className:"worktime-item",children:[(0,a.jsxs)("label",{className:"form-label",children:["Time:",(0,a.jsx)("input",{className:"form-input",type:"datetime-local",name:"time",value:i(e.time),onChange:e=>s(e,t),required:!0})]}),(0,a.jsxs)("label",{className:"form-label",children:["Number:",(0,a.jsx)("input",{className:"form-input",type:"number",name:"slots",value:e.slots||0,onChange:e=>s(e,t),required:!0})]}),(0,a.jsx)("button",{type:"button",className:"remove-btn",onClick:()=>l(t),children:"Remove"})]},t))),(0,a.jsx)("button",{type:"button",className:"add-btn",onClick:n,children:"Add Work Time"})]}),(0,a.jsx)("button",{type:"submit",className:"submit-btn",children:r?"Update":"Create"})]})]})}}}]);
//# sourceMappingURL=529.2f31469d.chunk.js.map