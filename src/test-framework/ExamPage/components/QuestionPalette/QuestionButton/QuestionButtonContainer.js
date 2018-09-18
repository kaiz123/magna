import React, {Component} from 'react';
import {QuestionButtonUI} from "./QuestionButtonUI";
import {changeQuestionCurrentAsyncAC} from "../../../../../_Redux/ActionCreators/Test/Questions-ActionCreator";
import {connect} from 'react-redux';


class QuestionButton extends Component {

    constructor(props) {
        super(props);
        this.questionClickHandler = this.questionButtonClickHandler.bind(this)

    }

    questionButtonClickHandler() {
        // id is the question current index in the section
        this.props.changeCurrentQuestion(this.props.questionID, this.props.id);
    }


    render() {
        console.log(this.props.questionID === this.props.currentQuestion);

        return (
            <QuestionButtonUI id={this.props.id} questionCallback={this.questionClickHandler} isCurrent={this.props.questionID === this.props.currentQuestion}/>
        )
    }


}

function mapStateToProps(state, ownProps) {

    return {
        currentQuestion: state.test.currentQuestion,
        ...ownProps

    }

}

function mapDispatchToProps(dispatch) {
    return {
        changeCurrentQuestion: (questionID, questionIndex) => {

            dispatch(changeQuestionCurrentAsyncAC(questionID, questionIndex));

        }
    }
}

const QuestionButtonContainer = connect(mapStateToProps, mapDispatchToProps)(QuestionButton);

export {QuestionButtonContainer}