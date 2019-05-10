import React from "react";

import { connect } from "react-redux";
import { userAccountLogin, userAccountCheckToken } from "../../store/actions/userActions";
import { history } from "../../store/store";
import axios from "axios";

import joi, { func } from "joi";
import { AuthForm } from "./AuthForm";
import { SignUpForm } from "./SignUpForm";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function switchForm(action: string, payload: any) {
  switch (action) {
    case "SIGNUP":
      return <SignUpForm {...payload} />;
    default:
      return <AuthForm {...payload} />;
  }
}

class AuthPage extends React.Component<any> {
  // state = {
  //   signIn: {
  //     username: "",
  //     password: "",
  //     validate: null as any,
  //     schema: {
  //       username: joi.string().error(e => "Поле не может быть пустым"),
  //       password: joi.string().error(e => "Поле не может быть пустым")
  //     }
  //   },
  //   signUp: {
  //     tags: [] as string[],
  //     tagInput: "",
  //     email: "",
  //     username: "",
  //     password: "",
  //     passwordRepeat: "",
  //     fullname: "",
  //     dob: "",
  //     description: "",
  //     socialUrl: "",
  //     city: "",
  //     schema: {
  //       email: joi
  //         .string()
  //         .email()
  //         .error(e => "Некорректная почта"),
  //       password: joi
  //         .string()
  //         .min(8)
  //         .error(e => "Не менее 8 символов"),
  //       passwordRepeat: joi
  //         // .extend()
  //         .string()
  //         .valid(joi.ref("password"))
  //         .error((e: any) => "Пароли должны совпадать")
  //     },
  //     validate: null as any
  //   },
  //   form: "AUTH",
  //   status: "IDLE"
  // };

  state = {
    signUp: {
      stages: [
        {
          correct: false,
          forceValidate: false,
          input: {} as any
        },
        {
          correct: false,
          forceValidate: false,
          input: {} as any
        }
      ],
      tags: [] as any,
      // completed: false,
      modal: false
    },
    signIn: {
      correct: false,
      forceValidate: false,
      input: {} as any
    },
    form: "AUTH"
  };

  login = () => {
    const { signIn } = this.state;
    if (signIn.correct) this.props.accountLogin(signIn.input.username, signIn.input.password);
    else this.setState({ signIn: { ...signIn, forceValidate: true } });
  };

  validatedSignIn = (correct: boolean, value: any) => {
    this.setState({ signIn: { ...this.state.signIn, correct, input: value } });
  };

  validatedSignUp = (stage: number, correct: boolean, value: any) => {
    const { signUp } = this.state;
    signUp.stages[stage] = {
      ...signUp.stages[stage],
      correct,
      input: value
    };
    this.setState({ signUp });
  };

  componentDidUpdate() {
    const { user, location } = this.props;
    // console.log(location);
    if (user.statuses.account.auth === "SUCCESS") history.push((location && location.state && location.state.redirect) || "/account/settings");
  }

  switchForm = (form: string) => {
    this.setState({ form });
  };

  addTag = (tag: string) => {
    const signUp = this.state.signUp;
    signUp.tags.push(tag);
    this.setState({ signUp });
  };
  removeTag = (tag: string) => {
    // this.props.removeTag(tag);
    const signUp = this.state.signUp;
    signUp.tags = signUp.tags.filter((t: string) => t != tag);
    this.setState({ signUp });
  };

  registration = () => {
    const { signUp } = this.state;
    const invalid = signUp.stages.find(s => !s.correct);
    if (invalid) {
      return this.forceSignUpValidate(1);
    }
    const { fullname, password, username, dob, city, socialUrl, email, description } = { ...signUp.stages[0].input, ...signUp.stages[1].input } as any;
    const [day, month, year] = dob.split(".");
    this.setState({ status: "LOADING" });
    const names = fullname.split(/\s+/);
    axios
      .get("/api/account/create", {
        params: {
          description,
          dob: new Date(year, month, day).getMilliseconds(),
          password,
          firstName: names[1],
          thirdName: names[2],
          secondName: names[0],
          email,
          tags: signUp.tags,
          username,
          city,
          socialUrl
        }
      })
      .then(res => {
        signUp.modal = true;
        this.setState({ signUp });
        // console.lo
        // this.props.accountCheckToken(res.data.token);
      })
      .catch(console.log);
  };

  forceSignUpValidate = (stage: number) => {
    const { signUp } = this.state;
    signUp.stages[stage].forceValidate = true;
    this.setState({ signUp });
  };

  render() {
    const { error, user } = this.props;
    const { signIn, form, signUp } = this.state;
    return (
      <div>
        <RegistrationSuccessModal open={signUp.modal} />
        {switchForm(form, {
          user,
          error,
          login: this.login,
          signIn,
          switchForm: this.switchForm,
          signUp,
          addTag: this.addTag,
          removeTag: this.removeTag,
          registration: this.registration,
          validatedSignIn: this.validatedSignIn,
          validatedSignUp: this.validatedSignUp,
          forceSignUpValidate: this.forceSignUpValidate
        })}
      </div>
    );
  }
}

class RegistrationSuccessModal extends React.Component<any> {
  render() {
    const { open } = this.props;
    return (
      <Modal isOpen={open}>
        <ModalHeader>Завершение регистрации</ModalHeader>
        <ModalBody>
          <p>Для активации аккаунта перейдите по ссылке в письме в указанном Вами почтовом ящике</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => window.location.reload()} className="rounded-0 w-100" color="primary">
            Завершить
          </Button>
          {/* <Button className="rounded-0" color="secondary" onClick={toggle}>
            Отмена
          </Button> */}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapDispatchToProps = {
  accountLogin: userAccountLogin,
  accountCheckToken: userAccountCheckToken
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  router: state.router
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);
