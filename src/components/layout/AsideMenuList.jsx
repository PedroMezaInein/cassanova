/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl} from "../../functions/routers"
import { LEADS_FRONT, MI_PROYECTO_FRONT } from "../../constants";

class AsideMenuList extends Component{

    openSubmenu = modulo => {
        let aux = document.getElementById(`submenu-${modulo}`);
        let x = document.getElementsByClassName("submenu-asidemenu");
        let cont = 0;
        for(cont = 0; cont < x.length; cont ++){
            if(x[cont] !== aux){
                x[cont].classList.remove('d-block')
            }else{
                if (!aux.classList.contains('d-block')) {
                    x[cont].classList.add('d-block')
                }else{
                    x[cont].classList.remove('d-block')
                }       
            }
        } 
    }

    closeAside = () => {
        if(document.body.classList.contains('aside-minimize-hover') ){
            document.body.classList.remove('aside-minimize-hover');       
            document.body.classList.add('aside-minimize');
        }
    }

    getUrlFromSub = (sub) => {
        const { name, url } = sub
        const { access_token } = this.props.props.authUser
        switch(name){
            case 'CRM':
                return `${LEADS_FRONT}${url}?tag=${access_token}`
            // case 'Mi Proyecto':
            //      return  `${MI_PROYECTO_FRONT}${url}?tag=${access_token}`
               
            default:
                return url;
        }
    }

    render(){
        const modulos = this.props.props.authUser.modulos ? this.props.props.authUser.modulos : [] 
        return(
            <ul className = 'menu-nav'>
                {
                    modulos.map( (modulo, key) => {
                        return(
                            <li className = 'menu-item menu-item-submenu' key = { key } data-menu-toggle = "hover"
                                onClick = { () => { console.log(modulo.slug); this.openSubmenu(modulo.slug) } }>
                                <div className="menu-link menu-toggle" to = { modulo.url } >
                                    <span className="svg-icon menu-icon">
                                        <SVG src={toAbsoluteUrl(modulo.icon)}/>
                                    </span>
                                    {
                                        modulo.url ? 
                                            <NavLink className="menu-text menu-link text-uppercase" to={modulo.url}>{modulo.name}</NavLink>
                                        : 
                                            <span className="menu-text menu-link text-uppercase" to={modulo.url}>{modulo.name}</span>
                                    }
                                    {
                                        modulo.modulos.length > 1 || modulo.url === null  ? 
                                            <i className="menu-arrow"  onClick = { () => { this.openSubmenu(modulo.slug) } }/>
                                        : ''
                                    }
                                </div>
                                {
                                    modulo.modulos.length > 1 || modulo.url === null ?
                                        <div className="menu-submenu submenu-asidemenu" id = {`submenu-${modulo.slug}`}>
                                            <i className="menu-arrow"  />
                                            <ul className="menu-subnav">
                                                <li className="menu-item  menu-item-parent">
                                                    <span className="menu-link">
                                                        <span className="menu-text">{modulo.name}</span>
                                                    </span>
                                                </li>
                                                {
                                                    modulo.modulos.map( (submodulo) => {
                                                        let url = this.getUrlFromSub(submodulo)
                                                        if(url.includes('https://') || url.includes('http://')){
                                                            return(
                                                                <li  key={submodulo.url} className={`menu-item `}>
                                                                    <a className="menu-link" href = { url } 
                                                                        onClick = { () => { this.closeAside() } }>
                                                                        <span className="svg-icon menu-icon">
                                                                            <SVG src={toAbsoluteUrl(submodulo.icon)} />
                                                                        </span>
                                                                        <span className="menu-text text-uppercase">{submodulo.name}</span>
                                                                    </a>
                                                                </li>
                                                            )
                                                        }else{
                                                            return(
                                                                <li  key={submodulo.url} className={`menu-item `}>
                                                                    <NavLink className="menu-link" to = { submodulo.url } 
                                                                        onClick = { () => { this.closeAside() } }>
                                                                        <span className="svg-icon menu-icon">
                                                                            <SVG src={toAbsoluteUrl(submodulo.icon)} />
                                                                        </span>
                                                                        <span className="menu-text text-uppercase">{submodulo.name}</span>
                                                                    </NavLink>
                                                                </li>
                                                            )
                                                        }
                                                        
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    : ''
                                }
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

export default AsideMenuList