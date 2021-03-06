var React = require('react');
var Task = require('Task');
var ModalNewTask = require('ModalNewTask');

var TasksList = React.createClass({
  getInitialState: function(){
    return {
      tasks: [],
      technologies: []
    }
  },
 componentDidMount: function() {
   this.getTechnologies();
   this.loadTasksFromServer();
 },
 wantModal: function(){
   this.setState({
     createNewTask: true
   })
 },
 dontWantModal: function(){
   this.setState({
     createNewTask: false
   })
 },
 loadTasksFromServer: function() {
    var url = "/" + this.props.params.stage;

    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(response) {
        this.setState({tasks: response});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
  getTechnologies: function(){
    var techs = []
    $.ajax({
      url: "/techs",
      dataType: 'json',
      cache: false,
      success: function(response) {
        response.map( (item) => {
          var tech = {
            name: item.name,
            image: item.image,
            active: false
          }

          techs.push(tech)
        })
        this.setState({
          technologies: techs
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },
 render: function(){
   var tasks = this.state.tasks;
   var technologies = this.state.technologies;
   var that = this;

   if( this.props.params.stage != this.state.stage ){
     this.loadTasksFromServer();
     this.state.stage = this.props.params.stage;
   }

   var renderTasks = function(){
     return tasks.map((task) => {
       return (
         <Task
          key={task._id}
          {...task}
          > </Task>
      )})
   };

   var message = "";
   var description = "";
   switch (this.props.params.stage) {
     case "wip":
       message = "Cooking"
       break;
     case "completed":
       message = "Finished"
       break;
     case "on-hold":
       message = "For later"
       break;
     default:

   }

   return (
     <div className="container-fluid box">
       <div className="container">
         <div className="col-md-12"><h1>{message}</h1></div>
     </div>
      {renderTasks()}
      <ModalNewTask showModal={this.state.createNewTask} onHandleClick={this.dontWantModal} technologies={technologies}/>
    </div>
   )
 }
});

module.exports = TasksList;
