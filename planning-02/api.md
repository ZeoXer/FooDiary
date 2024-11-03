### 登入相關

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>signup</code></summary>

##### Parameters

> | name     | type     | data type | description |
> | -------- | -------- | --------- | ----------- |
> | userName | required | string    | 使用者名稱  |
> | email    | required | string    | 信箱        |
> | password | required | string    | 密碼        |

##### Responses

> | http code | response   |
> | --------- | ---------- |
> | `200`     | `註冊成功` |

</details>

<details>
 <summary><code>PUT</code> <code><b>/</b></code> <code>login</code></summary>

##### Parameters

> | name     | type     | data type | description |
> | -------- | -------- | --------- | ----------- |
> | email    | required | string    | 信箱        |
> | password | required | string    | 密碼        |

##### Responses

> | http code | response   |
> | --------- | ---------- |
> | `200`     | `登入成功` |

</details>

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>forgetPassword</code></summary>

##### Parameters

> | name  | type     | data type | description |
> | ----- | -------- | --------- | ----------- |
> | email | required | string    | 信箱        |

##### Responses

> | http code | response             |
> | --------- | -------------------- |
> | `200`     | `已寄出重設密碼信件` |

</details>

<details>
 <summary><code>PUT</code> <code><b>/</b></code> <code>resetPassword</code></summary>

##### Parameters

> | name        | type     | data type | description |
> | ----------- | -------- | --------- | ----------- |
> | email       | required | string    | 信箱        |
> | newPassword | required | string    | 新密碼      |

##### Responses

> | http code | response       |
> | --------- | -------------- |
> | `200`     | `重設密碼成功` |

</details>

### 用戶相關

<details>
 <summary><code>PUT</code> <code><b>/</b></code> <code>updatePassword</code></summary>

##### Parameters

> | name        | type     | data type | description |
> | ----------- | -------- | --------- | ----------- |
> | email       | required | string    | 信箱        |
> | oldPassword | required | string    | 舊密碼      |
> | newPassword | required | string    | 新密碼      |

##### Responses

> | http code | response       |
> | --------- | -------------- |
> | `200`     | `更新密碼成功` |

</details>
