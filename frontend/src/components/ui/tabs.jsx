// frontend/src/components/ui/tabs.jsx
import React, { createContext, useContext, useState } from 'react'

// Context để chia sẻ trạng thái tab hiện tại
const TabsContext = createContext({ value: null, setValue: () => {} })

// Wrapper chính, lấy defaultValue làm tab đầu
export function Tabs({ children, defaultValue, className = '' }) {
  const [value, setValue] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// Container cho danh sách trigger buttons
export function TabsList({ children, className = '' }) {
  return <div className={className}>{children}</div>
}

// Nút kích hoạt tab
export function TabsTrigger({ value: tabValue, children, className = '' }) {
  const { value, setValue } = useContext(TabsContext)
  const isActive = value === tabValue
  return (
    <button
      className={`${className} ${isActive ? 'text-emerald-600 font-semibold' : ''}`}
      onClick={() => setValue(tabValue)}
    >
      {children}
    </button>
  )
}

// Nội dung từng tab; chỉ render khi value khớp
export function TabsContent({ value: tabValue, children, className = '' }) {
  const { value } = useContext(TabsContext)
  return value === tabValue ? <div className={className}>{children}</div> : null
}
