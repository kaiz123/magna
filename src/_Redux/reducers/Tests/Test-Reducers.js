/**
 *
 * Currently the `test` redux store looks like this:
 *
 *  {
 *
 *  loadingCount: 1,
 *  character : "<character>",
 *  id: "<test_id>",
 *  name: "<name of test>",
 *  price : "<price of test>",
 *  currentSection : "<current section id>",
 *  currentQuestion: "<current question id>",
 *  sections: {
 *
 *
 *  '73': { # section id , guaranteed to be unique
        id: 73,
        is_complete: false,
        section_id: 73,
        time_spent: 0,
        section_attempt_id: 15342,
        created_date: '2017-03-27T18:10:56',
        name: 'Logical Reasoning',
        test_id: 59,
        total_time: 3600
      },
       '74': {
        id: 74,
        is_complete: false,
        section_id: 74,
        time_spent: 0,
        section_attempt_id: 15343,
        created_date: '2017-03-27T18:15:41',
        name: 'Quantitative Aptitude',
        test_id: 59,
        total_time: 3600
      }
 *  },
 *
 *  questions: {
      '966': { # question id, guaranteed to be unique
        attempt_status: null,
        choice_id: null,
        question_id: 966,
        section_attempt_id: 15344,
        tita_choice: null,
        section_id: 75
      },
      '993': {
        attempt_status: null,
        choice_id: null,
        question_id: 993,
        section_attempt_id: 15344,
        tita_choice: null,
        section_id: 75
      }

 *
 *
 */
import {DECREMENT_LOADING, INCREMENT_LOADING, SECTION_PUSH_DETAILS, TEST_PUSH_ATTEMPTS, TEST_PUSH_DETAILS} from "../../actions/test";


const defaultState = {
    loadingCount: 1 // initially start with loading state

};

function testReducer(state = defaultState, action) {

    switch (action.type) {
        case INCREMENT_LOADING:
            return incrementLoading(state, action);
        case DECREMENT_LOADING:
            return decrementLoading(state, action);
        case TEST_PUSH_DETAILS:
            return pushTestDetails(state, action);

        case SECTION_PUSH_DETAILS:
            return pushSectionDetails(state, action);

        case TEST_PUSH_ATTEMPTS:
            return pushTestAttemptDetails(state, action);

        default :
            return state;
    }

}

/**
 * Increment loading key by one
 *
 * @param state
 * @param action
 * @returns {{loadingCount: number}}
 */
function incrementLoading(state, action) {
    const loadingCount = state.loadingCount;
    return {...state, loadingCount: loadingCount + 1}

}

/**
 * Decrement loading key one.
 * If the state's loadingCount is 0, it will not be
 * decremented (i.e. the minimum value of loadingCount is 0 )
 *
 * @param state
 * @param action
 * @returns {{loadingCount: number}}
 */
function decrementLoading(state, action) {
    const loadingCount = state.loadingCount;
    const newCount = loadingCount > 0 ? loadingCount - 1 : 0;

    return {...state, loadingCount: newCount}

}

/**
 * Insert details of the test (fetched from GET /tests/ID)
 *
 * @param state
 * @param action
 * @returns {{}}
 */
function pushTestDetails(state, action) {

    const {testDetails} = action;
    delete testDetails.instruction_html;

    return {...state, ...testDetails}


}

/**
 * Insert section details (fetched from GET /tests/<TEST_ID>/sections)
 *
 * @param state
 * @param sectionsList
 * @returns {{sections: *}}
 */
function pushSectionDetails(state, {sectionsList}) {

    const sections = sectionsList.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    return {...state, sections}

}

/**
 * Push Test Attempt Details (fetched from /tests/<TEST_ID>/attempts
 *
 * This should be called ONLY AFTER TEST DETAILS AND SECTION DETAILS ARE PUSHED
 *
 * It will merge the attempts of the test/section with the data of the test & section.
 *
 * @param state
 * @param testAttempt
 * @returns {{sections: {}, questions: ({}|*), currentSection: number, currentQuestion: number}}
 */
function pushTestAttemptDetails(state, {testAttempt}) {


    // get the section attempts from testAttempt object
    // and remove the question_attempts from each
    const sectionAttempts = testAttempt.section_attempts;

    const sectionAttemptsByID = sectionAttempts.reduce((obj, item) => {

        const copy = Object.assign({}, item);

        const attemptId = item.id;

        delete copy.question_attempts;

        obj[copy.section_id] = copy;
        obj[copy.section_id].section_attempt_id = attemptId;


        return obj;

    }, {});


    // merge the section attempt and section data together
    const merged = Object.keys(sectionAttemptsByID).reduce((obj, sectionID) => {

        obj[sectionID] = {...sectionAttemptsByID[sectionID], ...state.sections[sectionID]};

        return obj;

    }, {});


    // we need to flatten the question attempts
    // (currently it is nested under each section attempt

    let questions = testAttempt.section_attempts;

    // get all question attempts from the section_attempts
    questions = questions.map((item) => {

        return item.question_attempts;
    });


    questions = [].concat.apply(questions);
    questions = [].concat.apply([], questions); // flatten the nested arrays


    // we need to get which section a sectionAttempt belongs to
    // so we make a dictionary that maps sectionAttempt ID to section ID

    const sectionAttemptToSection = Object.keys(merged)
        .reduce((obj, sectionID) => {

            obj[merged[sectionID].section_attempt_id] = sectionID;

            return obj;

        }, {});


    // calculate which section the question attempt should belong to
    questions = questions.map((item) => {
        const section_id = sectionAttemptToSection[item.section_attempt_id];

        return {...item, section_id: parseInt(section_id)} //keys become strings, so force them back to int

    });

    // construct the questions object
    // the keys will be the question id, and the value will be the question object
    questions = questions.reduce((obj, item) => {
        obj[item.question_id] = item;
        return obj;
    }, {});


    // we need to find the first section that has is_complete = false

    const sortedSectionIds = Object.keys(merged).sort(); // sort sections ids

    const firstSectionId = sortedSectionIds.find((item) => {
        const intItem = parseInt(item);

        return merged[intItem].is_complete === false;
    });


    // we need to find the first question in the section that was just found

    const sortedQuestions = Object.keys(questions).sort();

    const firstQuestion = sortedQuestions.find((item) => {

        return parseInt(questions[item].section_id) === parseInt(firstSectionId);
    });


    return {
        ...state,
        sections: merged,
        questions,
        currentSection: parseInt(firstSectionId),
        currentQuestion: parseInt(firstQuestion)

    }

}


export {testReducer};