import React from "react";

import {
  Row,
  
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Table,
  Button,
  ButtonGroup,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./index.css";
import NumberFormat from "react-number-format";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import {
  Col,
  Form,
  FormGroup,
  Label,
  
  
  FormFeedback,
} from "reactstrap";

import CropfieldItemAPI from "../../services/request/CropfieldItem";
import { toast } from "react-toastify";
import ToastError from "../../services/request/ErrorReq";

const item_validation_default = {
  item_name_invalid: false,
  item_package_invalid: false,
};

const item_default = {
  cropfield_name: "",
  crop_name: "",
  crop_totalarea: 0,
  crop_processedarea: 0,
  
};

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.new ? item_default : props.itemDetail,
      item_validation: item_validation_default,
      is_new: props.new,
      in_proses: false,
    };
  }
  componentDidUpdate() {}
  componentDidMount() {}
  saveItem = () => {
    let req = this.state.item;
    if (req.item_name === "") {
      this.setState({
        item_validation: {
          ...this.state.item_validation,
          item_name_invalid: true,
        },
      });
      this.itemRef.focus();
      return;
    }
    if (req.item_package === "") {
      this.setState({
        item_validation: {
          ...this.state.item_validation,
          item_package_invalid: true,
        },
      });
      this.packageRef.focus();
      return;
    }
    this.state.is_new ? this.saveNewItem() : this.editItem();
  };
  saveNewItem() {
    CropfieldItemAPI.cropfielditemAdd(this.state.item)
      .then((result) => {
        toast.success(result.data.message);
        this.setState({ item: item_default });
        this.itemRef.focus();
        this.props.refreshItem();
      })
      .catch((err) => {
        ToastError(err);
        
      });
  }
  editItem() {
    CropfieldItemAPI.cropfielditemEdit(this.state.item)
      .then((result) => {
        toast.success(result.data.message);
        this.itemRef.focus();
        this.props.refreshItem();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    return (
      <CustomModal title={this.state.is_new ? "New Item" : "Edit Item"}>
        <Form>
          <FormGroup row>
            <Label sm={2}>Crop field name</Label>
            <Col sm={6}>
              <Input
                invalid={this.state.item_validation.item_name_invalid}
                autoFocus
                innerRef={(ref) => {
                  this.itemRef = ref;
                }}
                size="sm"
                type="text"
                name="cropfield_name"
                value={this.state.item.cropfield_name}
                placeholder="Crop field name"
                onChange={(event) => {
                  const { target } = event;
                  this.setState({
                    item: {
                      ...this.state.item,
                      cropfield_name: target.value,
                    },
                  });
                }}
              />
              <FormFeedback tooltip>Crop field is required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
          <Label sm={2}>Crop name</Label>
            <Col sm={6}>
              <Input
                invalid={this.state.item_validation.item_name_invalid}
                autoFocus
                innerRef={(ref) => {
                  this.itemRef = ref;
                }}
                size="sm"
                type="text"
                name="cropfield_name"
                value={this.state.item.crop_name}
                placeholder="Crop name"
                onChange={(event) => {
                  const { target } = event;
                  this.setState({
                    item: {
                      ...this.state.item,
                      crop_name: target.value,
                    },
                  });
                }}
              />
              <FormFeedback tooltip>Crop name is required</FormFeedback>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label sm={2}>Total crop area</Label>
            <Col sm={6}>
              <NumberFormat
                className="form-control-sm form-control"
                placeholder="0"
                type="text"
                name="crop_totalarea"
                value={this.state.item.crop_totalarea}
                thousandSeparator={true}
                inputmode="numeric"
                
                onValueChange={(values) => {
                  const { value } = values;
                  this.setState({
                    item: {
                      ...this.state.item,
                      crop_totalarea: value,
                    },
                  });
                }}
              />
            </Col>
          </FormGroup>
          
          <FormGroup row>
            <Label sm={2}></Label>
            <Col sm={6}>
              <Button color="primary" onClick={this.saveItem} title="Save Item">
                {this.props.new ? "Save Item" : "Edit Item"}
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </CustomModal>
    );
  }
}

export default Item;
