import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Checkbox from "../Checkbox";
import { TagInput } from "./TagInput";
import { connect } from "react-redux";

import axios from "axios";

import joi from "joi";
import InputCheck, { InputValidateGroup, InputValidate } from "../ValidateInputField";
import { addUserJob } from "../../store/actions/jobActions";

interface IJobModalProps {
  open: boolean;
  toggle: () => void;
}

function validationMessage(details: any[], field: string) {
  const det = details.find(c => c.context.key === field);
  if (det !== undefined) return det.message;
}

function isEmpty(str: string) {
  return str === undefined || str === null || str.length === 0 || !str.trim();
}

class AddJobModal extends React.Component<any & IJobModalProps> {
  state = {
    forceValidate: false,
    correct: false,
    input: {} as any,
    tags: [] as any[]
  };

  // state = {
  //   input: {
  //     label: "",
  //     description: "",
  //     timespan: "",
  //     tags: ["hi"],
  //     city: "",
  //     secretInfo: "",
  //     price: "",
  //     validate: null as any,
  //     schema: {
  //       label: joi
  //         .string()
  //         .min(5)
  //         .required()
  //         .error(e => "Минимум 5 символов"),
  //       description: joi
  //         .string()
  //         .min(10)
  //         .required()
  //         .error(e => "Минимум 10 символов"),
  //       timespan: joi
  //         .number()
  //         .integer()
  //         .required()
  //         .error(e => "Требуется целое число"),
  //       // city: joi.string(),
  //       // secretInfo: joi.string(),
  //       price: joi
  //         .number()
  //         .required()
  //         .integer()
  //         .error(e => "Требуется целое число")
  //     }
  //   }
  // };

  toggleCheckbox = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.id]: e.target.checked } });
  };
  pushJob = () => {
    const { correct, input, tags } = this.state;
    const { city, label, description, price, secretInfo, timespan } = input;

    if (!correct) return this.setState({ forceValidate: true });

    this.props.toggle();
    this.props.addJob({
      city: isEmpty(city) ? undefined : city,
      label,
      description,
      price,
      secretInfo: isEmpty(secretInfo) ? undefined : secretInfo,
      timespan: Number(timespan) * 60 * 60 * 1000,
      tags
    });
  };

  onChange = (e: any) => {
    const { input } = this.state;
    this.setState({ input: { ...input, [e.target.name]: e.target.value } });
  };

  addTag = (tag: string) => {
    const { tags } = this.state;
    tags.push(tag);
    this.setState({ tags });
  };
  removeTag = (tag: string) => {
    // this.props.removeTag(tag);
    const { tags } = this.state;
    this.setState({ tags: tags.filter((t: any) => t != tag) });
  };

  validated = (correct: boolean, value: any) => {
    this.setState({ correct, input: value });
  };

  render() {
    const { open, toggle } = this.props;
    const { label, description, timespan, price } = this.state.input;
    const { forceValidate, tags } = this.state;

    return (
      <div>
        <Modal isOpen={open} toggle={toggle}>
          <ModalHeader>Создание новой вакансии</ModalHeader>
          <ModalBody>
            <InputValidateGroup forceValidate={forceValidate} validated={this.validated}>
              <p>Заголовок</p>
              <InputValidate
                name="label"
                idleMessage="Наименование вашей вакансии"
                successMessage="Отлично"
                schema={joi
                  .string()
                  .min(5)
                  .required()
                  .error(e => "Минимум 5 символов")}
              >
                <input placeholder="Выгул собаки" className="w-100 mb-1" />
              </InputValidate>

              <p className="mt-3">Содержание вакансии</p>
              <InputValidate
                name="description"
                successMessage="Отлично"
                schema={joi
                  .string()
                  .min(5)
                  .required()
                  .error(e => "Минимум 5 символов")}
              >
                <textarea rows={5} placeholder="Работа заключается в.." className="w-100 mb-1" />
              </InputValidate>

              <p className="mt-3">Время выполнения (в часах)</p>
              <InputValidate
                name="timespan"
                successMessage="Отлично"
                hardCheck
                schema={joi
                  .number()
                  .integer()
                  .error(e => "Некорректное время")}
              >
                <input placeholder="3" className="w-100 mb-1" />
              </InputValidate>
              <p className="mt-3">Теги</p>
              <TagInput addTag={this.addTag} removeTag={this.removeTag} tags={tags} />

              <p>Город</p>
              <InputValidate
                idleMessage="По умолчанию - Ваш"
                successMessage="Отлично"
                name="city"
                schema={joi
                  .string()
                  .allow("")
                  .min(1)
                  .error(e => "Укажите город")}
              >
                <input placeholder="Москва" className="w-100 mb-1" />
              </InputValidate>

              <p className="mt-3">Скрытая информациия</p>
              <InputValidate successMessage="Отлично" idleMessage="Видна только нанятому Вами работнику" name="secretInfo" schema={joi.string()}>
                <textarea rows={5} placeholder="Ключ от дома - под горшком" className="w-100 mb-1" />
              </InputValidate>

              <p className="mt-3">Цена</p>

              <InputValidate
                name="price"
                successMessage="Отлично"
                schema={joi
                  .number()
                  .required()
                  .error(e => "Необходимое поле")}
              >
                <input className="w-100 mb-1 price" placeholder="1000₽" />
              </InputValidate>
            </InputValidateGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                this.pushJob();
              }}
              className="rounded-0"
              color="primary"
            >
              Опубликовать
            </Button>
            <Button className="rounded-0" color="secondary" onClick={toggle}>
              Отмена
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  addJob: addUserJob
};

export default connect(
  null,
  mapDispatchToProps
)(AddJobModal);
