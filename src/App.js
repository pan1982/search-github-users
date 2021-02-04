import React, {useEffect, useState} from 'react';
import { 
  Collapse, 
  Form, 
  FormGroup, 
  Label, 
  Input,
  Container,
  Row,
  Col,
  Spinner
} from 'reactstrap';
import './App.css';

//onClick={toggle} 

const mobileWidth = 767;
const fakeUsers = (function() {
  const res = [];
  for(let i = 1; i < 100; i++) {
    res.push({id: i, name: 'Test User' + i, repos: Math.floor(Math.random() * 10)})
  }
  return res;
})()


function App() {
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState(fakeUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [screenWidth, setScreenWidth]  = useState(window.innerWidth);
  const [isUsersLoading, setIsUsersLoading] = useState(true);



  const fetchUsers = (url) => {
    fetch(`https://api.github.com/${url}`)
    .then(response => {
      return response.json();
    }).then(json => {
      setUsers(json.map(async user => {
        const userResponse = await fetch(`${user.html_url}`);
        return await userResponse.json();
      }));
    })
}

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
    })
  });

  useEffect(() => {
      fetchUsers(userName ? `search/users?per_page=50&q=${userName}+in:name+type:user` : `users?per_page=100`);
  }, [userName]);


  return (
    <Container>
      <div className="header">
        Github Users
      </div>
      <Row>
        <Col md="6" className="users-block">
          <Form>
            <FormGroup>
              <Label>User Name</Label>
              <Input onChange={(e) => setUserName(e.target.value)} value={userName} />
            </FormGroup>
          </Form>
          {!isUsersLoading ? (<div className="users-block_items">
             {users.map(user => {
              return (
                <div key={user.id} className="user-item">
                  Name - {user.login}
                  {' '}Url - {user.html_url}
                </div>
              );
            })}
          </div>) : (
            <div>
              <p>Loading ...</p>
              <Spinner type="grow" color="secondary" />
            </div>
            
          )}
        </Col>
      {screenWidth <= mobileWidth ? (
      <Collapse isOpen={isOpen}>
      </Collapse>
      ) : (
        <Col md="6" className="user-block">
          Anim pariatur cliche reprehenderit,
          enim eiusmod high life accusamus terry richardson ad squid. Nihil
          anim keffiyeh helvetica, craft beer labore wes anderson cred
          nesciunt sapiente ea proident.
        </Col>
      )}

      </Row>

      
    </Container>
  );
}

export default App;
