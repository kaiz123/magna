import React from 'react';
import {ResendActivationMailApi} from "../../_Api/User";
import {toast} from 'react-toastify';
import {ResendActivationForm} from "./ResendActivationForm";
import {history} from "../../__internals/CustomHistory";


class ResendActivationContainer extends React.Component {

    constructor() {
        super();

        this.onSubmitCallback = this.onSubmitCallback.bind(this);
        this.registerRecaptchaInstanceCallback = this.registerRecaptchaInstanceCallback.bind(this);
    }

    registerRecaptchaInstanceCallback(recaptchaInstance) {
        console.log("registered");
        this.recaptchaInstance = recaptchaInstance;
    }

    onSubmitCallback(values, {setSubmitting, setErrors}) {


        ResendActivationMailApi(values.email, values.recaptcha).then(() => {

            toast.success("Email Successfully Resent!");
            history.push("/login");

        }).catch(({response}) => {

            setErrors({info: response.data.message});
            setSubmitting(false);
            this.recaptchaInstance.reset();

        });


    }

    render() {

        return (
            <ResendActivationForm onSubmitCallback={this.onSubmitCallback}
                                  registerRecaptchaInstanceCallback={this.registerRecaptchaInstanceCallback}
            />
        )

    }
}

export {ResendActivationContainer};



