// import { useEffect, useState } from "react";
// import "./index.css";

// export default function App() {
//   const [count, setCount] = useState(0);
//   const [dark, setDark] = useState(false);

//   // Toggle dark mode by adding/removing class on <html>
//   useEffect(() => {
//     const root = document.documentElement;
//     dark ? root.classList.add("dark") : root.classList.remove("dark");
//   }, [dark]);

//   return (
//     <main className="min-h-screen w-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors">
//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200 dark:border-slate-800">
//         <div className="container mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
//           <h1 className="text-xl font-bold">
//             Tailwind v3 Playground <span className="text-brand-500">🔥</span>
//           </h1>

//           <div className="flex items-center gap-3">
//           <button
//             onClick={() => setCount((c) => c + 1)}
//             className="btn-outline"
//           >
//             Count: {count}
//           </button>
//           <button
//             onClick={() => setDark((v) => !v)}
//             className="btn-primary"
//           >
//             {dark ? "Light mode" : "Dark mode"}
//           </button>
//           </div>
//         </div>
//       </header>

//       <div className="container mx-auto max-w-6xl px-4 py-10 space-y-16">
//         {/* Typography */}
//         <section>
//           <h2 className="text-3xl font-bold mb-6">Typography</h2>
//           <p className="text-lg">
//             This is a <span className="font-semibold">Tailwind</span> playground with{" "}
//             <span className="text-brand-500">custom brand color</span>, responsive grid, forms, tables, animations and more.
//           </p>
//           <ul className="list-disc pl-6 mt-3 space-y-1">
//             <li>Text colors: <span className="text-brand-600">brand-600</span>, <span className="text-slate-500">slate-500</span></li>
//             <li>Font: Inter (nếu bạn add vào project), fallback system-ui</li>
//             <li>Dark mode bằng class <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">dark</code> trên <code>html</code></li>
//           </ul>
//         </section>

//         {/* Buttons */}
//         <section className="space-y-4">
//           <h2 className="text-3xl font-bold">Buttons</h2>
//           <div className="flex items-center gap-3">
//             <button className="btn-primary">Primary</button>
//             <button className="btn-outline">Outline</button>
//             <button className="btn bg-emerald-500 text-white hover:bg-emerald-600">Success</button>
//             <button className="btn bg-rose-500 text-white hover:bg-rose-600">Danger</button>
//             <button className="btn bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600">Dark</button>
//           </div>
//         </section>

//         {/* Responsive Grid */}
//         <section className="space-y-6">
//           <h2 className="text-3xl font-bold">Responsive Grid</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="card hover:shadow-lg transition-shadow">
//                 <h3 className="text-lg font-semibold mb-2">Card #{i + 1}</h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis, molestias.
//                 </p>
//                 <button className="btn-primary mt-4 w-full">Action</button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Form */}
//         <section className="space-y-6">
//           <h2 className="text-3xl font-bold">Form</h2>
//           <form className="card space-y-4 max-w-lg">
//             <div>
//               <label className="label">Email</label>
//               <input type="email" className="input" placeholder="you@example.com" />
//             </div>
//             <div>
//               <label className="label">Password</label>
//               <input type="password" className="input" placeholder="••••••••" />
//             </div>
//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 text-sm">
//                 <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
//                 Remember me
//               </label>

//               <a href="#" className="text-brand-600 hover:underline text-sm">Forgot password?</a>
//             </div>
//             <button className="btn-primary w-full">Sign in</button>
//           </form>
//         </section>

//         {/* Table */}
//         <section className="space-y-6">
//           <h2 className="text-3xl font-bold">Table</h2>
//           <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-100 dark:bg-slate-800/60">
//                 <tr>
//                   <th className="px-4 py-2 font-semibold">Name</th>
//                   <th className="px-4 py-2 font-semibold">Role</th>
//                   <th className="px-4 py-2 font-semibold">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { name: "Alice", role: "Admin", status: "Active" },
//                   { name: "Bob", role: "User", status: "Pending" },
//                   { name: "Charlie", role: "Manager", status: "Banned" },
//                 ].map((u, i) => (
//                   <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
//                     <td className="px-4 py-2">{u.name}</td>
//                     <td className="px-4 py-2">{u.role}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={
//                           "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
//                           (u.status === "Active"
//                             ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
//                             : u.status === "Pending"
//                             ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
//                             : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300")
//                         }
//                       >
//                         {u.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Animations */}
//         <section className="space-y-6">
//   <h2 className="text-3xl font-bold">Animations</h2>

//     <div className="flex items-center gap-6">
//       {/* spin: spinner kiểu loader */}
//       <div className="h-12 w-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />

//       {/* pulse rõ hơn */}
//       <div className="h-12 w-12 rounded-full bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite]" />

//       {/* bounce (thấy rõ nhất) */}
//       <div className="h-12 w-12 rounded-full bg-rose-500 animate-bounce" />

//       {/* wiggle: hình vuông để thấy xoay */}
//       <div className="h-12 w-12 rounded-md bg-slate-500 animate-wiggle origin-bottom" />
//     </div>
//   </section>

//       </div>

//       {/* Footer */}
//       <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
//         Tailwind v3 Playground – build with 💙
//       </footer>
//     </main>
//   );
// }


import { Routes, Route } from "react-router-dom"
import { AppShell } from "@/components/app-shell/app-shell"
import Dashboard from "@/pages/dashboard"
import TablePage from "@/pages/table"
import ProfilePage from "@/pages/profile"

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/table" element={<TablePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AppShell>
  )
}
