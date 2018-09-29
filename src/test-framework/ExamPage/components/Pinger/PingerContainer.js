import React from 'react';
import {connect} from 'react-redux'
import {PingerUI} from "./PingerUI";
import {pingAPI} from "../../../../_Api/Tests/TestAttempts";
import {changeCurrentSectionAsyncAC, markCurrentSectionCompleteAC, submitCurrentSectionAsyncAC} from "../../../../_Redux/ActionCreators/Test/Sections/Sections-ActionCreator";
import {PING_TIME} from "./config";
import {markTestComplete} from "../../../../_Redux/reducers/Tests/Test-Reducers";
import {markTestCompleteAC} from "../../../../_Redux/ActionCreators/Test/TestAttempt-ActionCreators";
import {toast} from 'react-toastify';

/**
 * Orchestrate the Ping process.
 *
 * This container component is responsible for the
 * following tasks :
 *
 * 1. Update timer in UI every second
 * 2. Every 20 seconds, send a ping to the server (see pinger docs)
 * 3. If time left is 0, either submit test (for jumpable exams) or submit section(for non jumpable exams)
 * 3. Dispatch an action if time left on current section =0 and its a non jumpable section (i.e. switch sections)
 * 4. If time left is 0 , submit section (required for score calculation)
 *
 *
 *                      !!!!!!!!!! WARNING !!!!!!!!!!
 *
 * This component should be added to the DOM exactly once.
 * An if-else condition that conditionally renders this
 * component will break it if it is torn down and rendered a second time.
 *
 *
 */
class Pinger extends React.Component {

    /**
     * Tick function.
     * Will be called every second unless clear is called
     */
    tick() {


        if (this.tickCount > 0 && this.tickCount % PING_TIME === 0 && this.shouldPing) {
            pingAPI(this.props.testID, this.props.currentSectionID, this.props.currentQuestionID);
        }

        const timeLeft = this.state.timeLeft;


        if (timeLeft <= 0) {


            let sections = Object.keys(this.props.sections).sort();

            let isLast = sections.indexOf(this.props.currentSectionID) === sections.length - 1;

            if (!this.props.allowJumps) {
                this.props.submitCurrentSection(!isLast);
            }
            else {
                this.props.markTestComplete();
            }

        }

        if (timeLeft > 0) {
            this.setState((state, props) => {
                return {timeLeft: state.timeLeft - 1}

            });
            this.tickCount++;
        }

    }

    constructor(props) {
        console.log("cons called");
        super(props);
        this.tick = this.tick.bind(this);
        this.shouldPing = true;

        this.state = {
            timeLeft: this.props.timeLeft
        };


        if (!this.props.isTestComplete) {
            this.interval = setInterval(this.tick, 1000);
        }
        this.tickCount = 0;

    }


    render() {

        return (<PingerUI timeLeft={this.state.timeLeft} userName={this.props.user.full_name}/>)
    }

    componentDidUpdate(prevProps, prevState) {

        if (!prevProps.sections[this.props.currentSectionID].is_complete
            &&
            this.props.sections[this.props.currentSectionID].is_complete) {

            clearInterval(this.interval);
            this.shouldPing = false;
            toast.info("Section was automatically submitted");
            this.tickCount = 0;
            console.log("section was marked complete");

        }


        if (this.props.isError) {
            clearInterval(this.interval);
        }

        if (prevProps.currentSectionID !== this.props.currentSectionID) {
            console.log("currentSection changed");
            clearInterval(this.interval);
            this.shouldPing = false;

            this.tickCount = 0;
            this.shouldPing = true;

            this.tick();
            this.interval = setInterval(this.tick, 1000);

            let sections = Object.keys(this.props.sections).sort();

            if (sections.indexOf(this.props.currentSectionID) < sections.length - 1) {
            }


            this.setState({timeLeft: this.props.timeLeft});

        }

        // if (prevProps.timeLeft !== this.props.timeLeft) {
        //
        // }

    }
}


function mapStateToProps(state, ownProps) {

    let timeLeft = 0;

    // FIXME change hardcoded "CAT" after db update

    if (state.test.type === "CAT") {

        const timeSpent = state.test.sectionsByID[state.test.currentSection].time_spent;
        const totalTime = state.test.sectionsByID[state.test.currentSection].total_time;

        timeLeft = totalTime - timeSpent;

    }

    else {

        const time_details = Object.values(state.test.sectionsByID).reduce((obj, section) => {
            // all 'total_time' should have the same time, pick any
            obj.total_time = section.total_time;
            obj.time_spent += section.time_spent;
            return obj;

        }, {total_time: 0, time_spent: 0});
        timeLeft = time_details.total_time - time_details.time_spent;

    }

    return {
        timeLeft,
        user: state.user,
        testID: state.test.id,
        allowJumps: state.test.type !== "CAT", // fixme change from hardcoded string after db upgrade
        isTestComplete: state.test.is_complete,
        currentSectionID: state.test.currentSection,
        currentQuestionID: state.test.currentQuestion,
        sections: state.test.sectionsByID,
        isError: state.test.error !== null

    };

}

function mapDispatchToProps(dispatch) {

    return {
        changeCurrentSection: (sectionID) => {
            dispatch(changeCurrentSectionAsyncAC(sectionID))
        },

        markCurrentSectionComplete: () => {
            dispatch(markCurrentSectionCompleteAC());
        },

        submitCurrentSection: (shouldMove) => {
            dispatch(submitCurrentSectionAsyncAC(shouldMove));
        },
        markTestComplete: () => {
            dispatch(markTestCompleteAC());
        }


    }


}

export const PingerContainer = connect(mapStateToProps, mapDispatchToProps)(Pinger);


