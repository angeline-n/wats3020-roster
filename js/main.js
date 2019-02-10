/* JS for WATS 3020 Roster Project */

class Person{
  constructor(name, email, username){
    this.name = name;
    this.email = email;
    this.username = email.split('@')[0];
  }
}

class Student extends Person{
  constructor(name, email, username, attendance){
    super(name, email, username);
    this.attendance = [];
  }

  calculateAttendance(){
    let sum = 0;
    let percentage = 0;
    for (let value of this.attendance){
      sum = sum + value;
    }
    if (this.attendance.length === 0){
      return '0%';
    } else{
      percentage = (sum / this.attendance.length * 100).toFixed(2);
      return `${percentage}%`;
    }
  }
}

class Teacher extends Person{
  constructor(name, email, honorific){
    super(name, email);
    this.honorific = honorific; 
  }
}

class Course {
    constructor(courseCode, courseTitle, courseDescription){
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    addStudent(){
      let newStudentName = prompt('Please enter the student\'s name.','John Doe');
      let newStudentEmail =  prompt('Please enter the student\'s email address.','john.doe@email.com');
      this.students.push( new Student(newStudentName, newStudentEmail));
      updateRoster(this);
    }

    setTeacher(){
      let newTeacherName = prompt('Please enter the teacher\'s name.','Jane Doe');
      let newTeacherEmail = prompt('Please enter the teacher\'s email address.', 'jane.doe@email.com')
      let newTeacherHonorific = prompt('Please enter the teacher\'s honorific.', 'Dr.')
      this.teacher = new Teacher(newTeacherName, newTeacherEmail, newTeacherHonorific);
      updateRoster(this);
    }

    markAttendance(username, status = 'present'){
      let foundStudent = this.findStudent(username);
      if (status === 'present'){
        foundStudent.attendance.push(1);
      } else{
        foundStudent.attendance.push(0);
      }
    }


    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username){
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index){
            return student.username == username;
        });
        return foundStudent;
    }
}


let courseCode = prompt('Please enter the number/code of the course.','WATS3020');
let courseTitle = prompt('Please enter the name of the course.','Introduction to Javascript');
let courseDescription = prompt('Please enter the descriptive summary of the course.')

myCourse = new Course(courseCode, courseTitle, courseDescription);



///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher){
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e){
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e){
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course){
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher){
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students){
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons(){
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons){
        button.addEventListener('click', function(e){
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}

