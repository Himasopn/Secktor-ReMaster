'use strict';

const fetch = require('node-fetch');
const FormData = require('form-data');
const crypto = require('crypto');

class ACRCloud {
  constructor(config) {
    this.endpoint = '/v1/identify';
    this.signatureVersion = '1';
    this.host = config.host || 'identify-us-west-2.acrcloud.com';
    this.accessKey = config.access_key;
    this.accessSecret = config.access_secret;
    this.dataType = config.data_type || 'audio';
    this.audioFormat = config.audio_format || '';
    this.sampleRate = config.sample_rate || '';
    this.audioChannels = config.audio_channels || 2;
  }

  buildStringToSign(method, uri, accessKey, dataType, signatureVersion, timestamp) {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
  }

  sign(string, accessSecret) {
    return crypto
      .createHmac('sha1', accessSecret)
      .update(Buffer.from(string, 'utf-8'))
      .digest()
      .toString('base64');
  }

  generateFormData(object) {
    const form = new FormData();
    Object.entries(object).forEach(([key, value]) => {
      form.append(key, value);
    });
    return form;
  }

  /**
   * Identify an audio track from a file path
   * @param {Buffer} audioSample A buffer from an audio sample of the audio you want to identify
   * @returns {Promise<ACRCloudResponse>} response JSON from ACRCloud https://www.acrcloud.com/docs/acrcloud/metadata/music/
   */
  async identify(audioSample) {
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = this.buildStringToSign(
      'POST',
      this.endpoint,
      this.accessKey,
      this.dataType,
      this.signatureVersion,
      timestamp
    );
    const signature = this.sign(stringToSign, this.accessSecret);

    const formData = this.generateFormData({
      sample: audioSample,
      access_key: this.accessKey,
      data_type: this.dataType,
      signature_version: this.signatureVersion,
      signature: signature,
      sample_bytes: audioSample.length,
      timestamp: timestamp,
    });

    try {
      const response = await fetch(`https://${this.host}${this.endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error identifying audio:', error);
      throw error;
    }
  }
}

module.exports = ACRCloud;