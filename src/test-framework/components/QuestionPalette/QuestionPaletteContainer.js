import React, {Component} from 'react';
import {QuestionPaletteUI} from "./QuestionPaletteUI";
import {connect} from 'react-redux';

class QuestionPaletteContainer1 extends Component {

    render() {
        const questions = this.props.questions;
        return (
            <QuestionPaletteUI questions={questions}/>
        )
    }
}


function mapStateToProps(state) {


    return {
        questions: state.test.sectionsByID[state.test.currentSection].questions
    }
}

const QuestionPaletteContainer = connect(mapStateToProps, null)(QuestionPaletteContainer1);

export {QuestionPaletteContainer}