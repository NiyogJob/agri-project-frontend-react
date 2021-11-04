import React from "react";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import {
  Table,
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  FormFeedback,
  Label,
  FormGroup,
  Input,
  Col,
  Form,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import TractorAPI from "../../services/request/Tractors";
import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const tractor_validation_default = {
  tractor_name_invalid: false,
};
const tractor_default = {
  tractor_id: 0,
  tractor_name: "",
  tractor_address: "",
  tractor_phone: "",
};

class Tractor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDialog: false,
      selected_tractor: {},
      list_tractor: [],
      tractor: tractor_default,
      tractor_validation: tractor_validation_default,
      is_new: true,
      in_proses: false,
    };
  }
  saveTractor = () => {
    let req = this.state.tractor;
    if (req.tractor_name === "") {
      this.setState({
        tractor_validation: {
          ...this.state.tractor_validation,
          tractor_name_invalid: true,
        },
      });
      this.tractorRef.focus();
      return;
    }
    this.state.is_new ? this.saveNewtractor() : this.edittractor();
  };
  setTractorToCart = (index) => {
    this.props.callbackRequest(
      this.state.list_tractor[index].tractor_id,
      this.state.list_tractor[index].tractor_name
    );
  };
  deleteTractor = (id) => {
    TractorAPI.tractorDelete({ tractor_id: id })
      .then((result) => {
        toast.success(result.data.message);
        this.refreshTractor();
      })
      .catch((err) => {
        ToastError(err);
      });
  };
  getTractor = (index) => {
    this.setState({ tractor: this.state.list_tractor[index], is_new: false });
    this.toggleModal();
  };
  saveNewtractor() {
    TractorAPI.tractorAdd(this.state.tractor)
      .then((result) => {
        toast.success(result.data.message);
        this.setState({ tractor: tractor_default });
        this.tractorRef.focus();
        this.refreshTractor();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  edittractor() {
    TractorAPI.tractorEdit(this.state.tractor)
      .then((result) => {
        toast.success(result.data.message);
        this.refreshTractor();
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  componentDidMount() {
    this.refreshTractor();
  }
  toggleModal = () => {
    this.setState({ modalDialog: !this.state.modalDialog });
  };
  refreshTractor() {
    TractorAPI.tractorList()
      .then((result) => {
        this.setState({
          list_tractor: result.data.data,
        });
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    const tractorList = this.state.list_tractor;
    return (
      <CustomModal title="Tractor">
        <Button color="primary" onClick={this.toggleModal} className="mb-2">
          + Add Tractor
        </Button>
        <Table responsive hover borderless>
          <thead className="table-active">
            <tr>
              <th>#</th>
              <th>Name</th>
              
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tractorList.map((obj, index) => {
              return (
                <tr key={index.toString()}>
                  <td>{index + 1}</td>
                  <td>{obj.tractor_name}</td>
                  
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        title="Select tractor"
                        color="success"
                        onClick={() => {
                          this.setTractorToCart(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Select Tractor
                      </Button>
                      <Button
                        title="Edit Tractor"
                        color="warning"
                        onClick={() => {
                          this.getTractor(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </Button>
                      <Button
                        title="Delete Tractor"
                        onClick={() => {
                          this.deleteTractor(obj.tractor_id);
                        }}
                        color="danger"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Modal
          isOpen={this.state.modalDialog}
          size="lg"
          toggle={this.toggleModal}
        >
          <ModalHeader toggle={this.toggleModal}>
            {this.state.is_new ? "New Tractor" : "Edit Tractor"}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label sm={3}>Tractor Name</Label>
                <Col sm={8}>
                  <Input
                    invalid={
                      this.state.tractor_validation.tractor_name_invalid
                    }
                    autoFocus
                    innerRef={(ref) => {
                      this.tractorRef = ref;
                    }}
                    size="sm"
                    type="text"
                    name="tractor_name"
                    value={this.state.tractor.tractor_name}
                    placeholder="tractor name"
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({
                        tractor: {
                          ...this.state.tractor,
                          tractor_name: target.value,
                        },
                      });
                    }}
                  />
                  <FormFeedback tooltip>tractor name is required</FormFeedback>
                </Col>
              </FormGroup>
              
             
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>{" "}
            <Button color="primary" onClick={this.saveTractor}>
              {this.state.is_new ? "Save New" : "Edit Tractor"}
            </Button>
          </ModalFooter>
        </Modal>
      </CustomModal>
    );
  }
}

export default Tractor;
