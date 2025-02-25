import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilChatBubble,
  cilList,
  cilDescription,
  cilDrop,
  cilInbox,
  cilMoney,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilReportSlash,
  cilSpeedometer,
  cilStar,
  cilTransfer,
  cilUser,
  cilCheckAlt,
  cilPeople,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { jwtDecode } from 'jwt-decode' // Correct import

// Function to get user role from JWT token
const getUserRole = () => {
  const token = localStorage.getItem('token') // Adjust this if you store the token elsewhere
  if (token) {
    try {
      const decodedToken = jwtDecode(token)
      console.log('Decoded Token:', decodedToken) // Debug: log the decoded token
      return decodedToken.role // Adjust this if your role is stored under a different key
    } catch (error) {
      console.error('Failed to decode token', error)
      return null
    }
  }
  return null
}

const userRole = getUserRole()
console.log('User Role:', userRole) // Debug: log the user role

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  // Only display "Users" group if the user is "super_admin"
  ...(userRole === 'super_admin'
    ? [
        {
          component: CNavGroup,
          name: 'Users',
          icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Staff',
              to: '/staff',
            },
            {
              component: CNavItem,
              name: 'User',
              to: '/user',
            },
            {
              component: CNavItem,
              name: 'Admin',
              to: '/admin',
            },
          ],
        },
      ]
    : []),
  {
    component: CNavItem,
    name: 'Produk',
    to: '/management/products',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Transaksi',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Semua Transaksi',
        to: '/transaction',
      },
      {
        component: CNavItem,
        name: 'Transaksi Online',
        to: '/online',
      },
      {
        component: CNavItem,
        name: 'Transaksi Offline',
        to: '/offline',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Berita',
    to: '/berita',
    icon: <CIcon icon={cilInbox} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Data',
  },

  ...(userRole === 'super_admin' || userRole === 'admin'
    ? [
        // Tambahkan userRole === 'admin' di sini
        {
          component: CNavItem,
          name: 'Laporan',
          to: '/report',
          icon: <CIcon icon={cilReportSlash} customClassName="nav-icon" />,
        },
      ]
    : []),
]

export default _nav
