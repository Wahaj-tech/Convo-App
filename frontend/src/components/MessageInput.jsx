import React from 'react'
import useKeyboardSound from '../hooks/useKeyboardSound'
import { useState } from 'react';
import { useRef } from 'react';
import { useChatStore } from '../store/useChatStore';

function MessageInput() {
  const {playRandomKeyStrokeSound}=useKeyboardSound();
  const [text,setText]=useState("");
  const [imagePreview,setImagePreview]=useState("");
  const fileInputRef=useRef(null)
  const{sendMessage,isSoundEnable}=useChatStore();

  return (
    <div>MessageInput</div>
  )
}

export default MessageInput