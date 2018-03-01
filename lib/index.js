const axios = require('axios')

class Evada {
  constructor (config) {
    if (config && config.token) {
      this.token = config.token
    }
    if (config && config.containerId) {
      this.containerId = config.containerId
    }
    if (config && config.baseUrlOverride) {
      this.baseUrl = config.baseUrlOverride
    } else {
      this.baseUrl = 'https://api.evadacms.com'
    }
  }

  setToken (token) {
    this.token = token
  }

  setContainerId (containerId) {
    this.containerId = containerId
  }

  getContainerId () {
    return this.containerId
  }

  // Authentication

  authenticate (username, password) {
    return axios.post(
      `${this.baseUrl}/authenticate`,
      {
        username,
        password
      }
    )
      .then(response => response.data)
      .catch((error) => { throw error.response.data })
  }

  reAuthenticate (refreshToken) {
    return axios.post(
      `${this.baseUrl}/authenticate/token`,
      {
        refresh_token: refreshToken
      }
    )
      .then(response => response.data)
      .catch((error) => { throw error.response.data })
  }

  changePassword (password, newPassword, confirmPassword) {
    return axios.post(
      `${this.baseUrl}/accounts/password`,
      {
        password,
        new_password: newPassword,
        confirm_password: confirmPassword
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
      .then(response => response.data)
      .catch((error) => { throw error.response.data })
  }

  updateProfile (profileModel) {
    return axios.put(
      `${this.baseUrl}/accounts/${profileModel.userId}/profile`,
      {
        name: profileModel.name,
        initials: profileModel.initials,
        username: profileModel.username
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
      .then(response => response.data.user)
      .catch((error) => { throw error.response.data })
  }

  // Containers

  getContainers () {
    return axios.get(`${this.baseUrl}/containers`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.containers)
  }

  addContainer (name) {
    return axios.post(
      `${this.baseUrl}/containers`, { name },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.container)
  }

  updateContainer (container) {
    return axios.patch(
      `${this.baseUrl}/containers/${this.containerId}`, container,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.container)
  }

  getContainerOAuthClient () {
    return axios.get(`${this.baseUrl}/containers/${this.containerId}/oauth-client`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.client)
  }

  updateContainerOAuthClientSecret () {
    return axios.get(`${this.baseUrl}/containers/${this.containerId}/oauth-client-reset-password`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.client)
  }

  getContainerTokens () {
    return axios.get(`${this.baseUrl}/${this.containerId}/tokens`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.tokens)
  }

  createReadOnlyContainerToken () {
    return axios.post(
      `${this.baseUrl}/${this.containerId}/tokens`, { type: 'ro' },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.token)
  }

  createReadWriteContainerToken () {
    return axios.post(
      `${this.baseUrl}/${this.containerId}/tokens`, { type: 'rw' },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.token)
  }

  // Content Types

  getContentTypes () {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/content-types`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_types)
  }

  getContentType (contentTypeSlug) {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeSlug}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_type)
  }

  addContentType (name) {
    return axios.post(
      `${this.baseUrl}/${this.containerId}/content-types`, { name },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_type)
  }

  updateContentType (contentTypeSlug, contentType) {
    contentType.modules.forEach((m, index) => {
      if (m.options === '') {
        contentType.modules[index].options = null
      }
    })
    return axios.put(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeSlug}`, contentType,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_type)
  }

  deleteContentType (contentTypeId) {
    return axios.delete(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response)
  }

  // Content Type Modules

  deleteContentTypeModule (contentTypeSlug, contentTypeModuleId) {
    return axios.delete(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeSlug}/modules/${contentTypeModuleId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response)
  }

  addContentTypeModule (contentTypeSlug, title, type, options) {
    return axios.post(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeSlug}/modules`,
      {
        title,
        type,
        options: JSON.stringify(options)
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
      .then(response => response.data.content_type_module)
      .catch((error) => { throw error.response.data })
  }

  updateContentTypeModuleSlug (contentTypeSlug, currentSlug, slug) {
    return axios.patch(
      `${this.baseUrl}/${this.containerId}/content-types/${contentTypeSlug}/modules/${currentSlug}/slug`,
      { slug },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
      .then(response => response.data.content_type_module)
      .catch((error) => { throw error.response.data })
  }

  // Users
  getUser (username) {
    return axios.get(`${this.baseUrl}/users/${username}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.user)
  }

  // Content Items

  getContentItems (params) {
    let url = `${this.baseUrl}/${this.containerId}/content-items?`
    if (params) {
      if (params.lang !== undefined) {
        url = `${url}lang=${params.lang}`
      }
      if (params.skip !== undefined) {
        url = `${url}&skip=${params.skip}`
      }
      if (params.limit !== undefined) {
        url = `${url}&limit=${params.limit}`
      }
      if (params.excludeModules !== undefined) {
        url = `${url}&excludeModules=${params.excludeModules}`
      }
      if (params.extendedProperties !== undefined) {
        url = `${url}&extendedProperties=${params.extendedProperties}`
      }
    }

    return axios.get(url, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.content_items)
  }

  getContentItem (params) {
    let url = `${this.baseUrl}/${this.containerId}/content-items/${params.contentItemSlug}?`
    if (params) {
      if (params.contentItemSlug === undefined) {
        throw new Error('A content item slug was not specified.')
      }
      if (params.lang !== undefined) {
        url = `${url}lang=${params.lang}`
      }
      if (params.depth !== undefined) {
        url = `${url}&depth=${params.depth}`
      }
      if (params.extendedProperties !== undefined) {
        url = `${url}&extendedProperties=${params.extendedProperties}`
      }
    }
    return axios.get(url, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).then(response => response.data.content_item)
  }

  getContentItemLanguages (contentItemSlug) {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/content-items/${contentItemSlug}/languages`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.languages)
  }

  addContentItem (contentTypeSlug, name, contentItemSlug, lang) {
    const request = {
      name,
      content_type_slug: contentTypeSlug
    }
    if (contentItemSlug !== undefined) {
      request.content_item_slug = contentItemSlug
    }
    if (lang !== undefined) {
      request.language_code = lang
    }
    return axios.post(
      `${this.baseUrl}/${this.containerId}/content-items`, request,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_item)
  }

  updateContentItem (contentItemId, name) {
    return axios.put(
      `${this.baseUrl}/${this.containerId}/content-items/${contentItemId}`, { name },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.content_item)
  }

  updateContentItemSlug (contentItemSlug, slug) {
    return axios.patch(
      `${this.baseUrl}/${this.containerId}/content-items/${contentItemSlug}/slug`,
      { slug },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
      .then(response => response.data)
      .catch((error) => { throw error.response.data })
  }

  setWorkflowStep (contentItemId, label) {
    return axios.patch(
      `${this.baseUrl}/${this.containerId}/content-items/${contentItemId}/workflow-step`, { label },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.workflow_step)
  }

  deleteContentItem (contentItemId) {
    return axios.delete(
      `${this.baseUrl}/${this.containerId}/content-items/${contentItemId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response)
  }

  // Content Item Modules

  updateModule (moduleId, value, createRevision) {
    return axios.put(
      `${this.baseUrl}/${this.containerId}/modules/${moduleId}`,
      {
        value,
        create_revision: createRevision
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.module)
  }

  getModuleRevisions (moduleId) {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/modules/${moduleId}/revisions`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.modules)
  }

  // Workflow Steps

  getWorkflowSteps () {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/workflow-steps`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.workflow_steps)
  }

  updateWorkflowSteps (steps) {
    return axios.put(
      `${this.baseUrl}/${this.containerId}/workflow_steps`, steps,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.workflow_steps)
  }

  // Languages

  getLanguages () {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/languages`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.languages)
  }

  updateLanguage (language) {
    return axios.put(
      `${this.baseUrl}/${this.containerId}/languages`,
      {
        code: language.code,
        active: language.active,
        default: language.active
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.language)
  }

  // Assets

  getAssets () {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/assets`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.assets)
  }

  getAsset (assetId) {
    return axios.get(
      `${this.baseUrl}/${this.containerId}/assets/${assetId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.asset)
  }

  updateAssetMetadata (assetId, lang, title, description) {
    return axios.put(
      `${this.baseUrl}/${this.containerId}/assets/${assetId}/metadata`,
      {
        language_code: lang,
        title,
        description
      },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response.data.asset_metadata)
  }

  deleteAsset (fileName) {
    return axios.delete(
      `${this.baseUrl}/${this.containerId}/assets/${fileName}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).then(response => response)
  }

  getGoogle () {
    return axios.get('http://www.google.com').then(response => response)
  }
}

module.exports = Evada
