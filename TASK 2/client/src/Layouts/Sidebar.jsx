// import React, { useState } from "react";
// import styles from "../styles/sidebar.module.css";
// const sidebar = () => {
//       const [showSettings, setShowSettings] = useState(false);
//       const handleLogout = () => {
//         console.log("Logout clicked");
//       };

//       const handleSettings = () => {
//         setShowSettings(true);
//       };

   
//   return (
//     <>
//       <aside className={styles.sidebar}>
//         <div className={styles.logo}>
//           <h1>ToDoHQ</h1>
//         </div>

//         <div className={styles.userProfile}>
//           <div className={styles.userInfo}>
//             <div className={styles.userAvatar}>
//               <img
//                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
//                 alt="Profile"
//               />
//             </div>
//             <div className={styles.userDetails}>
//               <h3>Samson Uwaifo</h3>
//               <p>samson@email.com</p>
//             </div>
//           </div>
//         </div>

//         <nav className={styles.navMenu}>
//           <button className={`${styles.navItem} ${styles.active}`}>
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//             <span>My Task</span>
//           </button>

//           <button className={styles.navItem} onClick={handleSettings}>
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
//               />
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//               />
//             </svg>
//             <span>Settings</span>
//           </button>
//         </nav>

//         <div className={styles.logoutSection}>
//           <button className={styles.navItem} onClick={handleLogout}>
//             <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default sidebar;
