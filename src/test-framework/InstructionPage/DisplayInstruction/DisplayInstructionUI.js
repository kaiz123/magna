// Author @ Kyaw Khant Nyar
// Last Edit: Sept 3, 2018

// imports
import React from 'react'
import PropTypes from 'prop-types';
import {LoadingSpinner} from "../../ExamPage/LoadingSpinner";

/**
 * DisplayInstructionUI renders the Instructions and Start Test button
 * @param props: instruction: raw html instruction for the test
 * @returns {*}: instructions and a start button
 */
function DisplayInstructionUI(props) {

    // return a loading UI while the instructions is being loaded
    if (props.instructions === '') {
        return (
            <LoadingSpinner/>
        )
    }
    return (
        <div className='container my-4'>

            <div className='my-4'>
                <h3 className='alert alert-primary text-center'>
                    {props.name}
                </h3>
            </div>

            {/*Set the HTML from RAW HTML*/}
            <div dangerouslySetInnerHTML={{__html: props.instructions}}/>

            <div>
                <StartTestButton startfunc={props.startfunc}/>
            </div>

        </div>
    )

}

/**
 *
 * @param props: a call back function that tells the server that the client wants to start the exam
 * and create test attempt
 * @returns {*} the start test button
 */
function StartTestButton(props) {
    return (
        <div className='container'>
            <div className='row'>
                <button className="btn btn-primary col-lg-4 offset-4 col-4 offset-4 my-5" onClick={props.startfunc}>
                    Start Test
                </button>
            </div>
        </div>
    )

}


export {DisplayInstructionUI}


DisplayInstructionUI.propTypes = {
    startfunc: PropTypes.func,
    name: PropTypes.string,
    instructions: PropTypes.string,
}