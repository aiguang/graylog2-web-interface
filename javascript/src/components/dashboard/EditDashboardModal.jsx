'use strict';

var $ = require('jquery'); // excluded and shimed

var React = require('react/addons');
var BootstrapModal = require('../bootstrap/BootstrapModal');
var DashboardStore = require('../../stores/dashboard/DashboardStore');

var EditDashboardModal = React.createClass({
    getInitialState() {
        return {
            id: this.props.id,
            description: this.props.description,
            title: this.props.title
        };
    },
    _onDescriptionChange(event) {
        this.setState({description: event.target.value});
    },
    _onTitleChange(event) {
        this.setState({title: event.target.value});
    },
    render() {
        var header = <h2>Edit Dashboard {this.props.title}</h2>;
        var body = (
            <fieldset>
                <label>Title:</label>
                <input type="text" onChange={this._onTitleChange} value={this.state.title} required/>
                <label>Description:</label>
                <input type="text" onChange={this._onDescriptionChange} value={this.state.description}  required/>
            </fieldset>
        );
        return (
            <span>
                <button onClick={this.openModal} className="btn btn-mini">
                    <i className="icon-edit"></i> Edit
                </button>
                <BootstrapModal ref="modal" onCancel={this._closeModal} onConfirm={this._save} cancel="Cancel" confirm="Save">
                   {header}
                   {body}
                </BootstrapModal>
            </span>
        );
    },
    _closeModal() {
        this.refs.modal.close();
    },
    openModal() {
        this.refs.modal.open();
    },
    _save() {
        DashboardStore.saveDashboard(this.state, () => {
            this._closeModal();
            var idSelector = '[data-dashboard-id="' + this.state.id + '"]';
            $(idSelector + '.dashboard-title').html(this.state.title);
            $(idSelector + '.dashboard-description').html(this.state.description);
        });
    }
});

module.exports = EditDashboardModal;
