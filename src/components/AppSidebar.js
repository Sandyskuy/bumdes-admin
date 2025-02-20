import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CSidebar,
  CSidebarFooter,
} from '@coreui/react'

// sidebar nav config
import navigation from '../_nav'
import { AppSidebarNav } from './AppSidebarNav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear JWT token from local storage
    localStorage.removeItem('token')

    // Dispatch logout action to reset authentication state
    dispatch({ type: 'logout' })

    // Redirect to login page
    navigate('/login')
  }

  return (
    <CSidebar
      className="border-end bg-orange"
      colorScheme="dark"
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex bg-dark">
        <CButton onClick={handleLogout} className='bg-danger'>Logout</CButton>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
