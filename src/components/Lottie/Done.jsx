import React, { Component } from 'react'
import * as animationData from '../../assets/animate/confirmation.json'
import Lottie from 'react-lottie';

class Done extends Component{
    render(){
        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: animationData.default,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return(
            <div className="mx-auto">
                <Lottie options={defaultOptions}
                    height={200}
                    width={200}
                    isStopped={false}
                    isPaused={false}/>
            </div>
        )
    }
}

export default Done