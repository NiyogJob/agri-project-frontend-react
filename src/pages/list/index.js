import React from "react";
import "./index.css";
import CustomModal from "../../components/CustomModal";
import { Table, ButtonGroup, Button } from "reactstrap";
import SalesAPI from "../../services/request/Sales";
import ToastError from "../../services/request/ErrorReq";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import NumberFormat from "react-number-format";
import {
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  
  
  ListGroup,
  ListGroupItem,
} from "reactstrap";

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],

      search_item_keyword1: "",
      search_item_keyword2: "",
      search_item_keyword3: "",
      search_item_keyword4: ""
    };
  }

  deleteSales = (id) => {
    SalesAPI.salesDelete({ process_id: id })
      .then((result) => {
        toast.success(result.data.message);
        this.refreshSales();
      })
      .catch((err) => {
        ToastError(err);
      });
  };

  componentDidMount() {
    this.refreshSales();
  }

  refreshSales() {
    SalesAPI.salesList()
      .then((result) => {
        console.log(result);
        this.setState({
          list: result.data.data,
        });
      })
      .catch((err) => {
        ToastError(err);
      });
  }
  render() {
    const SalesList = this.state.list;
    const searchword1 = this.state.search_item_keyword1;
    const searchword2 = this.state.search_item_keyword2;
    const searchword3 = this.state.search_item_keyword3;
    const searchword4 = this.state.search_item_keyword4;
    return (
      <CustomModal title="Processed fields report">
        <Table responsive hover borderless>
          <thead className="table-active">
          <tr>
          <th>
          <Input
                    onChange={(event) => {
                      const { target1 } = event;
                      this.setState({ search_item_keyword1: target1.value });
                    }}
                    placeholder="BY FIELD"
                  />
                  </th>
                  <th>
               <Input
                    onChange={(event) => {
                      const { target2 } = event;
                      this.setState({ search_item_keyword2: target2.value });
                    }}
                    placeholder="BY TRACTOR"
                  />
                  </th>
                  <th>
                     <Input
                    onChange={(event) => {
                      const { target3 } = event;
                      this.setState({ search_item_keyword3: target3.value });
                    }}
                    placeholder="BY CULTURE"
                  />
                  </th>
                  <th>
                  <Input
                    onChange={(event) => {
                      const { target4 } = event;
                      this.setState({ search_item_keyword4: target4.value });
                    }}
                    placeholder="BY DATE"
                  />
                  </th>
          </tr>
            <tr>
              <th>Process #</th>
              <th>Tractor name</th>
              <th>Field name</th>
              <th>Culture name</th>
              <th>Process date</th>
              <th>Process area</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {SalesList.filter((itm) => 
                        (itm.field_name)
                          
                          .includes(searchword1)
                      ).map((obj, index) => {
              return (
                <tr key={index.toString()}>
                  <td>{obj.process_id}</td>
                  <td>{obj.tractor_name}</td>
                  <td>{obj.field_name}</td>
                  <td>{obj.culture_name}</td>
                  <td>{obj.process_date}</td>
                  <td>{obj.process_area}</td>
                  
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        title="Delete Sales"
                        onClick={() => {
                          this.deleteSales(obj.process_id);
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
      </CustomModal>
    );
  }
}

export default List;
