// API клиент для общения с сервером
const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (userData) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (credentials) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
  };

  // Survey endpoints
  surveys = {
    getAll: () => this.request('/surveys'),
    getById: (id) => this.request(`/surveys/${id}`),
    create: (surveyData) =>
      this.request('/surveys', {
        method: 'POST',
        body: JSON.stringify(surveyData),
      }),
    update: (id, surveyData) =>
      this.request(`/surveys/${id}`, {
        method: 'PUT',
        body: JSON.stringify(surveyData),
      }),
    delete: (id) =>
      this.request(`/surveys/${id}`, {
        method: 'DELETE',
      }),
  };

  // Answer endpoints
  answers = {
    submit: (answerData) =>
      this.request('/answers', {
        method: 'POST',
        body: JSON.stringify(answerData),
      }),
    getBySurvey: (surveyId) =>
      this.request(`/answers/survey/${surveyId}`),
    getById: (id) => this.request(`/answers/${id}`),
    delete: (id) =>
      this.request(`/answers/${id}`, {
        method: 'DELETE',
      }),
  };
}

export default new ApiClient();
