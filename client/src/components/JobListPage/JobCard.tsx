import React from "react";

const JobInfo = (props: { label: string } & any) => (
  <div className="mb-2">
    <p>{props.label}</p>
    <a href="#">
      <span>{props.children}</span>
    </a>
  </div>
);

interface IJobCardProps {
  label: string;
  tags: string[];
  description: string;
  author: string;
  distance: number;
  time: number;
  price: number;
}

class JobCard extends React.Component<IJobCardProps> {
  render() {
    const { label, tags, description, author, distance, time, price } = this.props;
    const hours = time / 1000 / 60 / 60;
    return (
      <div className="border rounded container-fluid no-gutters mb-2">
        <div className="row">
          <div className="col-sm-4 col-lg-3 border-bottom-0 border-md-right py-2 order-sm-1 order-2">
            <JobInfo label="Работодатель">{author}</JobInfo>
            <JobInfo label="Расстояние">{distance} м</JobInfo>
            <JobInfo label="Время выполнения">{hours} час</JobInfo>
            <JobInfo label="Предложенная цена">{price}₽</JobInfo>
            <button className="btn-primary btn w-100 rounded-0">Откинуться</button>
          </div>
          <div className="col py-2 order-1">
            <a href="#">
              <h3>{label}</h3>
            </a>
            <span>{tags.join(" | ")}</span>
            <hr />
            <span>{description}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default JobCard;
