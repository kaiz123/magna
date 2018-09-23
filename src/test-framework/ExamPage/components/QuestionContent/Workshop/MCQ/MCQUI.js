import React, {Component} from 'react';

function MCQUI(props) {


    return(

        <div>
            <div dangerouslySetInnerHTML={{__html: props.questionHtml}}/>
        <div className='form-check'>
            {
            props.choices.map((choice) => {
                const shouldChecked = (choice.id === props.currentChoice);

                console.log(choice.id + " : " + props.currentChoice + " -> " +shouldChecked);
                return (
                    <div className="card">
                <div className="card-body">
                <input className="form-check-input" name="choiceRadio" type="radio"
                       onChange={()=>props.mcqCallback(choice.id)}
                       id={choice.id} checked={shouldChecked}/>
                <label className="form-check-label"><div dangerouslySetInnerHTML={{__html: choice.html}}/></label>

                </div> </div>
            )
        })
            }

        </div>
            </div>
        )
}
export {MCQUI}