import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosCanceler } from '@/api/helper/axiosCancel'
import { searchRoute, searchRouteMeta } from '@/utils/utils'
import { rootRouter } from '@/router/routes'
import { getToken } from '@/utils/authCookie'
import { ROUTER_WHITE_LIST } from '@/config/config'
import useStore from '@/mobx/index'

const axiosCanceler = new AxiosCanceler()

// 路由守卫组件
const AuthRouter = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { header } = useStore()
  const route = searchRoute(pathname, rootRouter) // 查询当前路由地址下的路由信息

  useEffect(() => {
    const token = getToken()
    console.log('路由守卫组件\n    ↓↓↓\n', route)

    if (token && pathname.includes('login')) {
      return window.history.go(-1) // 符合情况跳转上一个路由
    }

    const breadNavList: any = pathname == '/home' ? [] : searchRouteMeta(pathname, rootRouter) // FIXME:待优化、这里是针对两层menu来获取对应的path的title、需要考虑多层
    header.setBreadcrumbArr(breadNavList) // 存入mobx
    // console.log('面包屑集合：', breadNavList)

    // 路由跳转前、清除所有请求
    axiosCanceler.removeAllPending()

    // 没有token则重定向登录页
    if (!token && ROUTER_WHITE_LIST.indexOf(pathname) === -1) {
      navigate('/login', { replace: true })
    }
  }, [pathname])

  return children
}

export default AuthRouter
