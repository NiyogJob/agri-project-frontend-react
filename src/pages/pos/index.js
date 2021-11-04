import React from "react";
import {
  Row,
  Col,
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

import Tractor from "../tractor";
import Item from "../item";
import List from "../list";

import CropfieldItemAPI from "../../services/request/CropfieldItem";
import SalesAPI from "../../services/request/Sales";

import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faEdit,
  faSync,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const CustomCalender = ({ value, onClick }) => (
  <Button color="success" onClick={onClick}>
    {value}
  </Button>
);

const format_mysql_date = (d) => {
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

class POS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_item: true,
      cart: {
        tractor_id: 0,
        
        date_display: new Date(),
        list_cart: [],
        process_date: format_mysql_date(new Date()),
        process_area: 0,
        tractor_name: "",
        field_name:"",
        crop_totalarea:0,
        culture_name:"",

      },
      list_item: [],
      editItem: {},
      search_item_keyword: "",
      refresh_animation: false,
    };
  }

  cancelTransaction = () => {
    let y = window.confirm("Cancel Transaction ?");
    y && this.resetObject();
  };

  refreshItem() {
    this.setState({ refresh_animation: true });
    CropfieldItemAPI.cropfielditemList()
      .then((result) => {
        this.setState({
          list_item: result.data.data,
          refresh_animation: false,
        });
      })
      .catch((err) => {
        ToastError(err);
        this.setState({ refresh_animation: false });
      });
  }

  newTractor = () => {
    this.props.history.push("/tractors");
  };

  listSales = () => {
    this.props.history.push("/processfield");
  };
 

  newItem = () => {
    this.setState({ new_item: true, editItem: {} });
    this.props.history.push("/cropfielditem");
  };

  editItem = (index) => {
    this.setState({ new_item: false, editItem: this.state.list_item[index] });
    this.props.history.push("/cropfielditem");
  };

  deleteItem = (index) => {
    let detail = this.state.list_item[index];
    let del = window.confirm("Delete item : " + detail.item_name + " ?");
    if (del) {
      CropfieldItemAPI.cropfielditemDelete({ cropfield_name: detail.cropfield_name })
        .then((result) => {
          toast.success(result.data.message);
          this.refreshItem();
        })
        .catch((err) => {
          ToastError(err);
        });
    }
  };

  addCart = (index) => {
    let listCart = this.state.cart.list_cart;
    let newItem = this.state.list_item[index];
    index = listCart.findIndex((x) => x.item_id === newItem.cropfield_name);
    if (index < 0) {
      listCart.push({
        
        item_qty: 1,
        crop_totalarea: newItem.crop_totalarea,
        field_name: newItem.cropfield_name,
        culture_name:newItem.crop_name
        
      });
    } else {
      listCart[index].item_qty += 1;
      listCart[index].item_subtotal =
        parseFloat(newItem.item_price) * parseFloat(listCart[index].item_qty);
    }
    this.setState({ cart: { ...this.state.cart, list_cart: listCart } });
  };
  handleDecQty = (index) => {
    let listCart = this.state.cart.list_cart;
    if (listCart[index].item_qty === 1) {
      return;
    }
    listCart[index].item_qty -= 1;
    listCart[index].item_subtotal =
      parseFloat(listCart[index].item_price) *
      parseFloat(listCart[index].item_qty);
    this.setState({ cart: { ...this.state.cart, list_cart: listCart } });
  };
  handleIncQty = (index) => {
    let listCart = this.state.cart.list_cart;
    listCart[index].item_qty += 1;
    listCart[index].item_subtotal =
      parseFloat(listCart[index].item_price) *
      parseFloat(listCart[index].item_qty);
    this.setState({ cart: { ...this.state.cart, list_cart: listCart } });
  };
  deleteCart = (index) => {
    let listCart = this.state.cart.list_cart;
    listCart.splice(index, 1);
    this.setState({ cart: { ...this.state.cart, list_cart: listCart } });
  };
  resetObject() {
    this.setState({
      cart: {
        tractor_id: 0,
        
        date_display: new Date(),
        list_cart: [],
        process_date: format_mysql_date(new Date()),
        process_area: 0,
        tractor_name: "",
        field_name:"",
        crop_totalarea:0,
        culture_name:"",

      },
      list_item: [],
      editItem: {},
      search_item_keyword: "",
      refresh_animation: false,
    });
  }
  payTransaction = (obj) => {
    let cart = this.state.cart;
    if (cart.tractor_id === 0) {
      toast.error("Please choose tractor before save");
      this.newTractor();
      return;
    }
    if (cart.list_cart.length <= 0) {
      toast.error("The fields are empty to process");
      return;
    }
    let y = window.confirm("Process fields?");
    if (y) {
      SalesAPI.salesAdd(this.state.cart)
        .then((result) => {
          this.resetObject();
          toast.success(result.data.message);
        })
        .catch((err) => {
          ToastError(err);
        });
    }
  };
  setTractor = (id, custname) => {
    this.setState({
      cart: {
        ...this.state.cart,
        tractor_id: id,
        tractor_name: custname,
      },
    });
    this.props.history.goBack();
  };

  componentDidUpdate() {}
  componentDidMount() {
    this.refreshItem();
  }

  render() {
    const itemlist = this.state.list_item;
    const searchword = this.state.search_item_keyword;
    const listCart = this.state.cart.list_cart;
    
    this.state.cart.list_cart.forEach((obj) => {
      
    });
    

    return (
      <>
        <Row className="main-pos">
          <Col sm={4}>
            <Col className="main-pos-left" sm={12}>
              <div className="container-header">
                <div className="container-header-1">
                  <InputGroup>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={this.state.cart.date_display}
                      onChange={(date) =>
                        this.setState({
                          cart: {
                            ...this.state.cart,
                            date_display: date,
                            process_date: format_mysql_date(date),
                          },
                        })
                      }
                      customInput={<CustomCalender />}
                    />

                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <FontAwesomeIcon icon={faUser} />
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div className="container-header-2">
                  <Button color="info" onClick={this.newTractor} block>
                    {this.state.cart.tractor_id === 0
                      ? "+ Add Tractor"
                      : this.state.cart.tractor_name}
                  </Button>
                </div>
              </div>
              <div className="container-cart">
                <div className="container-cart-list">
                  <ListGroup flush>
                    {listCart.map((obj, index) => {
                      return (
                        <ListGroupItem key={index.toString()}>
                          <div className="cart-name">
                            <div>{obj.field_name}</div>
                          </div>
                          <div className="cart-detail">
                            <div className="cart-1">
                            Input the processed field<Input
                          type="number"
                          placeholder="0"
                         
                         
                          size="md"
                          
                          
                          
                          onChange={(event) => {
                            const { target } = event;
                            
                            listCart[index].process_area = target.value;
                            this.setState({
                              cart: {
                                ...this.state.cart,
                                list_cart: listCart,
                              },
                            });
                          }}
                          
                          
                        />
                              {"  "}
                              Total area:
                              {obj.crop_totalarea}
                              {"  "}
                              
                              
                            </div>

                            
                            <div className="cart-3">
                              <FontAwesomeIcon
                                className="text-danger pointer-hand"
                                title="Delete item from cart"
                                icon={faTimes}
                                onClick={() => {
                                  this.deleteCart(index);
                                }}
                              />
                            </div>
                          </div>
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </div>
                <div className="container-cart-recap">
                  
                
                  
                </div>
              </div>
            </Col>
          </Col>
          <Col sm={8}>
            <Col className="main-pos-right" sm={12}>
              <div className="mb-3">
                <InputGroup size="sm">
                  <Input
                    onChange={(event) => {
                      const { target } = event;
                      this.setState({ search_item_keyword: target.value });
                    }}
                    placeholder="SEARCH CROP FIELD..."
                  />
                  <InputGroupAddon addonType="append">
                    <ButtonGroup title="Refresh item list" size="sm">
                      <Button
                        color="warning"
                        onClick={() => {
                          this.refreshItem();
                        }}
                      >
                        <FontAwesomeIcon
                          spin={this.state.refresh_animation}
                          icon={faSync}
                        />
                      </Button>
                      <Button color="primary" onClick={this.newItem}>
                        {" "}
                        ADD CROP FIELD
                      </Button>
                    </ButtonGroup>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div>
                <Table responsive hover borderless>
                  <thead className="table-active">
                    <tr>
                      <th>Cropfield name</th>
                      <th>Crop name</th>
                      <th className="text-right">Total area</th>
                      <th className="text-right">Unprocessed area</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      itemlist
                      .filter((itm) =>
                        itm.cropfield_name
                          .toUpperCase()
                          .includes(searchword.toUpperCase())
                      )
                      .map((obj, index) => {
                        return (
                          <tr key={index.toString()}>
                            <td>{obj.cropfield_name}</td>
                            <td>{obj.crop_name}</td>
                            <td className="text-right">{obj.crop_totalarea}</td>
                            <td className="text-right">{obj.crop_processedarea}</td>
                            <td className="text-center">
                              <ButtonGroup size="sm">
                                <Button
                                  onClick={() => {
                                    this.addCart(index);
                                  }}
                                  title="Add to process"
                                  color="success"
                                >
                                   + Add to process field
                                </Button>
                                <Button
                                  title="Edit master item"
                                  color="warning"
                                  onClick={() => {
                                    this.editItem(index);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </Button>
                                <Button
                                  title="Delete item"
                                  onClick={() => {
                                    this.deleteItem(index);
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
              </div>
              <div>
                <Button
                  onClick={this.payTransaction}
                  color="success"
                  className="mr-1"
                >
                  Process added fields..
                </Button>
                
                <Button onClick={this.listSales} color="info">
                  Report
                </Button>
              </div>
            </Col>
          </Col>
        </Row>

        <Switch>
          <Route exact path="/" />
          <Route
            path="/tractors"
            render={() => (
              <Tractor
                new={this.state.new_tractor}
                callbackRequest={(id, custname) => {
                  this.setTractor(id, custname);
                }}
                tractorDetail={this.state.editTractor}
              />
            )}
          />
          <Route path="/processfield">
            <List />
          </Route>
          <Route
            path="/cropfielditem"
            render={() => (
              <Item
                new={this.state.new_item}
                refreshItem={() => {
                  this.refreshItem();
                }}
                itemDetail={this.state.editItem}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(POS);
