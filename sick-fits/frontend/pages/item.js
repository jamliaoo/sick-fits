import Link from "next/link";
import SingleItem from "../components/SingleItem";

const Item = props => {
  return (
    <div>
      <SingleItem id={props.id} />
    </div>
  );
};

export default Item;
