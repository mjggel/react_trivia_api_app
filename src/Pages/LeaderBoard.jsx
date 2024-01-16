import React, { useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';
import EmptyMessage from '../Utils/EmptyMessages.json';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Leaderboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const onlyUserWithRanking = users.filter((user) => user.ranking);
  const [sortedUsers, setSortedUsers] = useState(
    onlyUserWithRanking.sort((a, b) => a?.ranking?.score - b?.ranking?.score)
  );
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryToSort, setCategoryToSort] = useState('score');

  const handleSort = (categoryValue) => {
    setCategoryToSort(categoryValue);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  useEffect(() => {
    if (onlyUserWithRanking.length === 0) {
      setSortedUsers([]);
      return;
    }
    const sorted = [...onlyUserWithRanking].sort((a, b) => {
      if (categoryToSort === 'name' || categoryToSort === 'username') {
        return sortOrder === 'asc'
          ? a[categoryToSort].localeCompare(b[categoryToSort])
          : b[categoryToSort].localeCompare(a[categoryToSort]);
      }
      return sortOrder === 'asc'
        ? a.ranking[categoryToSort] - b.ranking[categoryToSort]
        : b.ranking[categoryToSort] - a.ranking[categoryToSort];
    });
    setSortedUsers(sorted);
  }, [sortOrder, categoryToSort]);

  return (
    <Container className='text-center' style={{ marginTop: '30px' }}>
      <Container>
        <Row>
          <Col>
            <Button
              className='p-3'
              variant='ouline-info'
              data-testid='btn-go-login'
              style={{
                backgroundColor: 'transparent',
                display: 'flex',
              }}
              onClick={() => navigate(location.state?.from || '/login')}
            >
              <AiOutlineArrowLeft size={30} />
            </Button>
          </Col>
          <Col>
            <h1>Leaderboard</h1>
          </Col>
          <Col></Col>
        </Row>
      </Container>

      <hr />
      <span className='text-center'>the default comparation is by score</span>
      {onlyUserWithRanking && onlyUserWithRanking.length > 0 ? (
        <Table
          className='shadow-lg rounded p-3 mb-5 py-5'
          striped
          bordered
          hover
          variant='dark'
        >
          <thead>
            <tr>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('score')}
              >
                #
              </th>
              <th scope='col'>pfp</th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('name')}
              >
                name
              </th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('username')}
              >
                Username
              </th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('difficulty')}
              >
                difficulty
              </th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('assertions')}
              >
                Assertions
              </th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('date')}
              >
                date
              </th>
              <th
                scope='col'
                style={{ cursor: 'pointer' }}
                onClick={() => handleSort('score')}
              >
                Score
              </th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {sortedUsers.map((sortedUser, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>
                  <Image
                    src={sortedUser.userpicture}
                    alt={sortedUser.name}
                    style={{ width: '40px', height: '40px' }}
                    roundedCircle
                  />
                </td>
                <td data-testid={`user-name-${index + 1}`}>
                  {sortedUser.name}
                </td>
                <td data-testid={`user-username-${index + 1}`}>
                  {sortedUser.username}
                </td>
                <td data-testid={`user-difficulty-${index + 1}`}>
                  {sortedUser.ranking.difficulty}
                </td>
                <td data-testid={`user-assertions-${index + 1}`}>
                  {sortedUser.ranking.assertions}
                </td>
                <td data-testid={`user-date-${index + 1}`}>
                  {sortedUser.ranking.date}
                </td>
                <td data-testid={`user-score-${index + 1}`}>
                  {sortedUser.ranking.score}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Table
          className='shadow-lg rounded p-3 mb-5 py-5'
          striped
          bordered
          hover
          variant='dark'
        >
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Empty Empty...</th>
            </tr>
          </thead>
          <tbody className='table-group-divider'>
            {EmptyMessage.descriptions.map((messages, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>

                <td>{messages}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default connect()(Leaderboard);
