import React, {Component, Fragment} from "react";
import "./TreeView.css";
import CheckboxTree from 'react-checkbox-tree';
import ReactTable from "react-table";
import 'react-table/react-table.css'

export default class TreeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: [],
            checked: [],
            expanded: [],
            isLoading: false,
            schemaName: this.props.schemaName,
            login: this.props.login,
            password: this.props.password,
            dbType: this.props.dbType,
            isCredetialsCorrect: this.props.isAuthenticated,
            fullPath: "",
            sqlQuery: "",
            checkedNode: [],
            attributes: []
        }


        //this.onClickLoadBtn = this.onClickLoadBtn.bind(this);
        //this.onClickNode = this.onClickNode.bind(this);
    }

    componentDidMount() {
        let data = {
            "schemaName": this.state.schemaName,
            "login": this.state.login,
            "password": this.state.password,
            "dbType": this.state.dbType,
        };

        if(this.state.isCredetialsCorrect) {
            this.executeFetchOnComponentDidMount(data);
        }
    }

    executeFetchOnComponentDidMount = (data) => {
        fetch('http://localhost:8080/tree', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => this.setState({tree: [data], isLoading: false}))
            .catch(error =>
                console.log('Request failed', error));
    }

    onClickLoadBtn = (loadType) => {
        const currentTree = this.ref.state.model.flatNodes["/Schemas"];

        let data = {
            "schemaName": this.state.schemaName,
            "login": this.state.login,
            "password": this.state.password,
            "dbType": this.state.dbType,
            "loadType": loadType,
            "fullPath": this.state.fullPath,
            "container": currentTree
        };

        fetch('http://localhost:8080/check', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(response => this.setState({tree: [response]}))
            .catch(error =>
                console.log('Request failed', error));
    }

    onClickPrintButton = () => {
        const currentTree = this.ref.state.model.flatNodes["/Schemas"];

        let data = {
            "dbType": this.state.dbType,
            "fullPath": this.state.fullPath,
            "container": currentTree
        };

        fetch('http://localhost:8080/print', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(response => this.setState({sqlQuery: response}))
            .catch(error =>
                console.log('Request failed', error));
    }

    onClickSqlDownloadBtn = () => {
        const currentTree = this.ref.state.model.flatNodes["/Schemas"];

        let data = {
            "dbType": this.state.dbType,
            "fullPath": this.state.fullPath,
            "container": currentTree
        };

        fetch(`http://localhost:8080/download`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.blob());

        //const blob = await response.blob();
    }

    buildAttributeArray = (attributesObject) => {
        let attrArray = [];
        for (var k in attributesObject) {
            let singleAttr = {
                key: k,
                value: attributesObject[k] === false ? "false" : attributesObject[k]
            };
            attrArray.push(singleAttr);
        }
        return attrArray;
    }

    onClickNode = (node) => {
        this.setState({fullPath: node.value});
        this.setState({checkedNode: node});
        if(node.value !== "/Schemas") {
            this.executeOnClickNode(node.parent, node);
        }
    }

    executeOnClickNode = (parent, child) => {
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].value === child.value) {
                this.setState({attributes: this.buildAttributeArray(parent.children[i].attributes)});
            }
        }
    }

    /*updateCredentialsStatus = (status) => {
        this.setState({isCredetialsCorrect: status})
    }*/

    render() {

        const columns = [{
            Header: 'Key',
            accessor: 'key',
        }, {
            Header: 'Value',
            accessor: 'value',
        }
        ];

        const {tree, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>
        } else if (!this.state.isCredetialsCorrect) {
            return (<div className="loginFirst">
                <h3>Please login first!</h3>
            </div>);

        } else {
            return (
                <div>
                    <div className="CheckBoxexAndButtons">
                        <Fragment>
                            <div className="CheckBox">
                                <CheckboxTree
                                    ref={(ref) => {
                                        if (!this.ref) {
                                            this.ref = ref
                                        }
                                    }}
                                    nodes={this.state.tree}
                                    key={tree.value}
                                    onClick={(node) => this.onClickNode(node)}
                                    checked={this.state.checked}
                                    expanded={this.state.expanded}
                                    onCheck={checked => this.setState({checked})}
                                    onExpand={expanded => this.setState({expanded})}
                                />
                            </div>
                            <label htmlFor="sqlquery">SQL query:</label>
                            <textarea className="SqlQuery" id="sqlquery" name="sqlquery"
                                      value={this.state.sqlQuery}></textarea>
                            <div className="ReactTableAttributes">
                                <ReactTable
                                    data={this.state.attributes}
                                    columns={columns}
                                />
                            </div>
                            <button onClick={(event) => this.onClickSqlDownloadBtn()}
                                    className="sql-download-btn">Download sql file
                            </button>
                        </Fragment>
                    </div>
                    <Fragment>
                        <div className="Buttons">
                            <button onClick={(event) => this.onClickLoadBtn("lazy")} className="lazy-btn">Lazy
                                load
                            </button>
                            <button onClick={(event) => this.onClickLoadBtn("detail")}
                                    className="detail-btn">Detailed load
                            </button>
                            <button onClick={(event) => this.onClickLoadBtn("full")} className="full-btn">Full
                                load
                            </button>
                            <button onClick={(event) => this.onClickPrintButton()} className="print-btn">Print
                            </button>
                        </div>
                    </Fragment>
                </div>
            );
        }
    }
}