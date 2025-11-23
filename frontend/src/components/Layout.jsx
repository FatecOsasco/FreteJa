import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import '../styles/theme.css'

export default function Layout({ children }) {
  return (
    <div className="layout-shell">
      <Header />
      <main className="layout-main">
        <aside className="layout-sidebar">
          <Sidebar />
        </aside>
        <section className="layout-content">{children}</section>
      </main>
    </div>
  )
}
