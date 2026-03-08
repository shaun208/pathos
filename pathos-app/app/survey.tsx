// // import React, { useState, useRef } from 'react';
// // import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
// // import { useRouter } from 'expo-router';
// // import axios from 'axios';
// // import MultiSlider from '@ptomasroos/react-native-multi-slider';

// // const API_URL = 'http://10.180.8.239:3000/api/survey'; 

// // export default function Survey() {
// //   const router = useRouter();
// //   const [history, setHistory] = useState<any[]>([]);
  
// //   const [question, setQuestion] = useState('What area of your life feels like it needs the most focus right now?');
// //   const [inputType, setInputType] = useState<'mcq' | 'text' | 'time-slider'>('mcq');
// //   const [textAnswer, setTextAnswer] = useState('');
// //   const [options, setOptions] = useState<any[]>([
// //     'Productivity & Focus',
// //     'Stress & Overwhelm',
// //     'Emotional Balance & Mood',
// //     'Social Confidence'
// //   ]);
  
// //   const [timeRange, setTimeRange] = useState([7, 23]);
// //   const [loading, setLoading] = useState(false);
// //   const isSubmitting = useRef(false);

// //   const formatTime = (hour: number) => {
// //     if (hour === 24 || hour === 0) return '12:00 AM';
// //     const ampm = hour >= 12 ? 'PM' : 'AM';
// //     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
// //     return `${formattedHour}:00 ${ampm}`;
// //   };

// //   const getSafeText = (opt: any): string => {
// //     if (typeof opt === 'string') return opt;
// //     if (typeof opt === 'object' && opt !== null) {
// //       return Object.values(opt)[0] as string || "Invalid Option";
// //     }
// //     return String(opt);
// //   };

// //   const handleSubmit = async (answer: string) => {
// //     if (isSubmitting.current || !answer.trim()) return; 
    
// //     isSubmitting.current = true;
// //     setLoading(true);
// //     Keyboard.dismiss(); // Drop the keyboard immediately when they submit

// //     const newHistory = [...history, { role: 'user', content: answer }];
// //     try {
// //       const response = await axios.post(API_URL, { messages: newHistory });
// //       const data = response.data;

// //       if (data.isComplete) {
// //         const encodedPathway = encodeURIComponent(JSON.stringify(data.pathway));
// //         router.push({ pathname: '/pathway', params: { data: encodedPathway } });
// //       } else {
// //         setQuestion(data.nextQuestion);
// //         setInputType(data.inputType || 'mcq'); 
// //         setOptions(Array.isArray(data.options) ? data.options : []); 
// //         setHistory([...newHistory, { role: 'model', content: data.nextQuestion }]);
// //         setTextAnswer(''); 
// //       }
// //     } catch (err) {
// //       console.error("Network Error:", err);
// //       alert("Server disconnected. Check your terminal!");
// //     } finally {
// //       isSubmitting.current = false; 
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
// //       {/* --- NEW FIX: Touchable wrapper to dismiss keyboard --- */}
// //       <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
// //         <View style={styles.container}>
// //           <Text style={styles.text}>{question}</Text>
          
// //           {loading ? (
// //             <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
// //           ) : inputType === 'time-slider' ? (
// //             <View style={styles.sliderContainer}>
// //               <Text style={styles.timeDisplayText}>
// //                 Wake: <Text style={styles.boldTime}>{formatTime(timeRange[0])}</Text>
// //               </Text>
// //               <Text style={styles.timeDisplayText}>
// //                 Sleep: <Text style={styles.boldTime}>{formatTime(timeRange[1])}</Text>
// //               </Text>
              
// //               <View style={styles.sliderWrapper}>
// //                 <MultiSlider
// //                   values={[timeRange[0], timeRange[1]]}
// //                   sliderLength={280}
// //                   onValuesChange={(values) => setTimeRange(values)}
// //                   min={0}
// //                   max={24}
// //                   step={1}
// //                   allowOverlap={false}
// //                   snapped
// //                   selectedStyle={{ backgroundColor: '#000' }}
// //                   markerStyle={{ backgroundColor: '#000', height: 28, width: 28, borderRadius: 14 }}
// //                   trackStyle={{ height: 6, borderRadius: 3, backgroundColor: '#e1e4e8' }}
// //                 />
// //               </View>

// //               <TouchableOpacity 
// //                 style={styles.submitButton} 
// //                 onPress={() => handleSubmit(`I wake up at ${formatTime(timeRange[0])} and go to sleep at ${formatTime(timeRange[1])}.`)}
// //               >
// //                 <Text style={styles.submitButtonText}>Confirm Schedule</Text>
// //               </TouchableOpacity>
// //             </View>
// //           ) : inputType === 'text' ? (
// //             <View style={styles.textInputContainer}>
// //               <TextInput 
// //                 style={styles.textInput} 
// //                 placeholder="E.g., 2800 cals, lean bulk..."
// //                 value={textAnswer}
// //                 onChangeText={setTextAnswer}
// //                 multiline
// //                 maxLength={250} 
// //               />
// //               <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(textAnswer)}>
// //                 <Text style={styles.submitButtonText}>Submit</Text>
// //               </TouchableOpacity>
// //             </View>
// //           ) : (
// //             <View style={styles.buttonContainer}>
// //               {options.map((opt, index) => {
// //                 const safeText = getSafeText(opt);
// //                 return (
// //                   <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleSubmit(safeText)}>
// //                     <Text style={styles.optionText}>{safeText}</Text>
// //                   </TouchableOpacity>
// //                 );
// //               })}
// //             </View>
// //           )}
// //         </View>
// //       </TouchableWithoutFeedback>
// //     </KeyboardAvoidingView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 30, backgroundColor: '#fcfcfc', justifyContent: 'center' },
// //   text: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#1a1a1a', lineHeight: 32 },
// //   buttonContainer: { width: '100%', gap: 16 },
// //   optionButton: { backgroundColor: '#ffffff', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1.5, borderColor: '#e1e4e8', elevation: 2, alignItems: 'center' },
// //   optionText: { fontSize: 16, color: '#333', fontWeight: '600', textAlign: 'center' },
// //   textInputContainer: { width: '100%', gap: 15 },
// //   textInput: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e1e4e8', borderRadius: 16, padding: 20, fontSize: 16, minHeight: 120, textAlignVertical: 'top' },
// //   sliderContainer: { width: '100%', alignItems: 'center', gap: 20 },
// //   timeDisplayText: { fontSize: 18, color: '#555', marginBottom: 5 },
// //   boldTime: { fontWeight: 'bold', color: '#000', fontSize: 20 },
// //   sliderWrapper: { marginVertical: 20, alignItems: 'center' },
// //   submitButton: { backgroundColor: '#000', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 16, alignItems: 'center', width: '100%' },
// //   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// // });



// import React, { useState, useRef } from 'react';
// import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { useRouter } from 'expo-router';
// import axios from 'axios';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import { CameraView, useCameraPermissions } from 'expo-camera';

// const API_URL = 'http://10.180.8.239:3000/api/survey'; 
// const VISION_URL = 'http://10.180.8.239:3000/api/analyze-face'; 

// export default function Survey() {
//   const router = useRouter();
//   const [history, setHistory] = useState<any[]>([]);
  
//   const [question, setQuestion] = useState('What area of your life feels like it needs the most focus right now?');
//   const [inputType, setInputType] = useState<'mcq' | 'text' | 'time-slider' | 'camera'>('mcq');
//   const [textAnswer, setTextAnswer] = useState('');
//   const [options, setOptions] = useState<any[]>(['Productivity & Focus', 'Stress & Overwhelm', 'Emotional Balance & Mood', 'Social Confidence']);
  
//   const [timeRange, setTimeRange] = useState([7, 23]);
//   const [loading, setLoading] = useState(false);
//   const [visionLoading, setVisionLoading] = useState(false);
//   const isSubmitting = useRef(false);

//   // Camera State
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<any>(null);

//   const formatTime = (hour: number) => {
//     if (hour === 24 || hour === 0) return '12:00 AM';
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//     return `${formattedHour}:00 ${ampm}`;
//   };

//   const getSafeText = (opt: any): string => {
//     if (typeof opt === 'string') return opt;
//     if (typeof opt === 'object' && opt !== null) return Object.values(opt)[0] as string || "Invalid Option";
//     return String(opt);
//   };

//   const handleScanFace = async () => {
//     if (!cameraRef.current) return;
//     setVisionLoading(true);
//     try {
//       // Take a low-quality picture so the base64 string doesn't crash the network
//       const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.2 });
      
//       // Send to Groq Vision Model
//       const response = await axios.post(VISION_URL, { imageBase64: photo.base64 });
//       const diag = response.data;
      
//       const combinedDiagnosis = `My face scan results: Diagnosis: ${diag.diagnosis}. Suggested Morning Routine: ${diag.morningRoutine}. Suggested Night Routine: ${diag.nightRoutine}. Please incorporate this into my schedule.`;
      
//       setVisionLoading(false);
//       handleSubmit(combinedDiagnosis); // Feed the diagnosis to the survey!
//     } catch (err) {
//       console.error(err);
//       alert("Face scan failed. Check terminal.");
//       setVisionLoading(false);
//     }
//   };

//   const handleSubmit = async (answer: string) => {
//     if (isSubmitting.current || !answer.trim()) return; 
    
//     isSubmitting.current = true;
//     setLoading(true);
//     Keyboard.dismiss(); 

//     const newHistory = [...history, { role: 'user', content: answer }];
//     try {
//       const response = await axios.post(API_URL, { messages: newHistory });
//       const data = response.data;

//       if (data.isComplete) {
//         const encodedPathway = encodeURIComponent(JSON.stringify(data.pathway));
//         router.push({ pathname: '/pathway', params: { data: encodedPathway } });
//       } else {
//         setQuestion(data.nextQuestion);
//         setInputType(data.inputType || 'mcq'); 
//         setOptions(Array.isArray(data.options) ? data.options : []); 
//         setHistory([...newHistory, { role: 'model', content: data.nextQuestion }]);
//         setTextAnswer(''); 
//       }
//     } catch (err) {
//       console.error("Network Error:", err);
//       alert("Server disconnected. Check terminal!");
//     } finally {
//       isSubmitting.current = false; 
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//         <View style={styles.container}>
//           <Text style={styles.text}>{question}</Text>
          
//           {loading ? (
//             <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
//           ) : inputType === 'camera' ? (
//             <View style={styles.cameraContainer}>
//               {!permission?.granted ? (
//                 <View style={styles.permissionBox}>
//                   <Text style={styles.permissionText}>We need camera access to analyze your skin.</Text>
//                   <TouchableOpacity style={styles.submitButton} onPress={requestPermission}>
//                     <Text style={styles.submitButtonText}>Grant Permission</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <>
//                   <View style={styles.cameraWrapper}>
//                     <CameraView style={styles.camera} facing="front" ref={cameraRef} />
//                   </View>
//                   <TouchableOpacity style={styles.submitButton} onPress={handleScanFace} disabled={visionLoading}>
//                     {visionLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Scan My Skin</Text>}
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           ) : inputType === 'time-slider' ? (
//              <View style={styles.sliderContainer}>
//              <Text style={styles.timeDisplayText}>
//                Wake: <Text style={styles.boldTime}>{formatTime(timeRange[0])}</Text>
//              </Text>
//              <Text style={styles.timeDisplayText}>
//                Sleep: <Text style={styles.boldTime}>{formatTime(timeRange[1])}</Text>
//              </Text>
             
//              <View style={styles.sliderWrapper}>
//                <MultiSlider
//                  values={[timeRange[0], timeRange[1]]}
//                  sliderLength={280}
//                  onValuesChange={(values) => setTimeRange(values)}
//                  min={0}
//                  max={24}
//                  step={1}
//                  allowOverlap={false}
//                  snapped
//                  selectedStyle={{ backgroundColor: '#000' }}
//                  markerStyle={{ backgroundColor: '#000', height: 28, width: 28, borderRadius: 14 }}
//                  trackStyle={{ height: 6, borderRadius: 3, backgroundColor: '#e1e4e8' }}
//                />
//              </View>

//              <TouchableOpacity 
//                style={styles.submitButton} 
//                onPress={() => handleSubmit(`I wake up at ${formatTime(timeRange[0])} and go to sleep at ${formatTime(timeRange[1])}.`)}
//              >
//                <Text style={styles.submitButtonText}>Confirm Schedule</Text>
//              </TouchableOpacity>
//            </View>
//           ) : inputType === 'text' ? (
//             <View style={styles.textInputContainer}>
//               <TextInput style={styles.textInput} placeholder="Type your answer here..." value={textAnswer} onChangeText={setTextAnswer} multiline maxLength={250} />
//               <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(textAnswer)}>
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.buttonContainer}>
//               {options.map((opt, index) => {
//                 const safeText = getSafeText(opt);
//                 return (
//                   <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleSubmit(safeText)}>
//                     <Text style={styles.optionText}>{safeText}</Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 30, backgroundColor: '#fcfcfc', justifyContent: 'center' },
//   text: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#1a1a1a', lineHeight: 32 },
//   buttonContainer: { width: '100%', gap: 16 },
//   optionButton: { backgroundColor: '#ffffff', paddingVertical: 18, paddingHorizontal: 20, borderRadius: 16, borderWidth: 1.5, borderColor: '#e1e4e8', elevation: 2, alignItems: 'center' },
//   optionText: { fontSize: 16, color: '#333', fontWeight: '600', textAlign: 'center' },
//   textInputContainer: { width: '100%', gap: 15 },
//   textInput: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e1e4e8', borderRadius: 16, padding: 20, fontSize: 16, minHeight: 120, textAlignVertical: 'top' },
//   sliderContainer: { width: '100%', alignItems: 'center', gap: 20 },
//   timeDisplayText: { fontSize: 18, color: '#555', marginBottom: 5 },
//   boldTime: { fontWeight: 'bold', color: '#000', fontSize: 20 },
//   sliderWrapper: { marginVertical: 20, alignItems: 'center' },
//   submitButton: { backgroundColor: '#000', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 16, alignItems: 'center', width: '100%' },
//   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
//   // New Camera Styles
//   cameraContainer: { width: '100%', alignItems: 'center', gap: 20 },
//   cameraWrapper: { width: 300, height: 400, borderRadius: 20, overflow: 'hidden', borderWidth: 4, borderColor: '#000' },
//   camera: { flex: 1 },
//   permissionBox: { alignItems: 'center', padding: 20, gap: 15 },
//   permissionText: { fontSize: 16, textAlign: 'center', color: '#555' }
// });

import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CameraView, useCameraPermissions } from 'expo-camera';

const API_URL = 'http://10.180.8.239:3000/api/survey'; 
const VISION_URL = 'http://10.180.8.239:3000/api/analyze-face'; 
const { width } = Dimensions.get('window');

export default function Survey() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  
  const [question, setQuestion] = useState('What area of your life feels like it needs the most focus right now?');
  const [inputType, setInputType] = useState<'mcq' | 'text' | 'time-slider' | 'camera'>('mcq');
  const [textAnswer, setTextAnswer] = useState('');
  const [options, setOptions] = useState<any[]>(['Productivity & Focus', 'Stress & Overwhelm', 'Emotional Balance & Mood', 'Social Confidence']);
  
  const [timeRange, setTimeRange] = useState([7, 23]);
  const [loading, setLoading] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const isSubmitting = useRef(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const formatTime = (hour: number) => {
    if (hour === 24 || hour === 0) return '12:00 AM';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:00 ${ampm}`;
  };

  const getSafeText = (opt: any): string => {
    if (typeof opt === 'string') return opt;
    if (typeof opt === 'object' && opt !== null) return Object.values(opt)[0] as string || "Invalid Option";
    return String(opt);
  };

const handleScanFace = async () => {
    if (!cameraRef.current) return;
    setVisionLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.1 });
      const response = await axios.post(VISION_URL, { imageBase64: photo.base64 });
      const diag = response.data;
      const combinedDiagnosis = `My face scan results: Diagnosis: ${diag.diagnosis}. Suggested Morning Routine: ${diag.morningRoutine}. Suggested Night Routine: ${diag.nightRoutine}. Please incorporate this into my schedule.`;
      
      setVisionLoading(false);
      handleSubmit(combinedDiagnosis); 
    } catch (err) {
      setVisionLoading(false);
      console.error("Vision API Error:", err);
      
      // --- THE HACKATHON DEMO FAILSAFE ---
      alert("AI Vision is currently over capacity or timed out. Injecting a fallback diagnosis so you can continue!");
      
      // Force the app to move forward even if the server crashes
      handleSubmit("My face scan results: Diagnosis: Combination skin with mild dryness. Suggested Morning Routine: Gentle Cleanser, Vitamin C, SPF 30. Suggested Night Routine: Hydrating Cleanser, Hyaluronic Acid, Rich Moisturizer. Please incorporate this into my schedule.");
    }
  };

  const handleSubmit = async (answer: string) => {
    if (isSubmitting.current || !answer.trim()) return; 
    
    isSubmitting.current = true;
    setLoading(true);
    Keyboard.dismiss(); 

    const newHistory = [...history, { role: 'user', content: answer }];
    try {
      const response = await axios.post(API_URL, { messages: newHistory });
      const data = response.data;

      if (data.isComplete) {
        const encodedPathway = encodeURIComponent(JSON.stringify(data.pathway));
        router.push({ pathname: '/pathway', params: { data: encodedPathway } });
      } else {
        setQuestion(data.nextQuestion);
        setInputType(data.inputType || 'mcq'); 
        setOptions(Array.isArray(data.options) ? data.options : []); 
        setHistory([...newHistory, { role: 'model', content: data.nextQuestion }]);
        setTextAnswer(''); 
      }
    } catch (err) {
      console.error("Survey Network Error:", err);
      // --- NO MORE SILENT FAILURES ---
      alert("The AI tripped up! Check your Node terminal for the exact error.");
    } finally {
      isSubmitting.current = false; 
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.questionCard}>
            <Text style={styles.text}>{question}</Text>
          </View>
          
          <View style={styles.contentArea}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#111827" />
              </View>
            ) : inputType === 'camera' ? (
              <View style={styles.cameraContainer}>
                {!permission?.granted ? (
                  <View style={styles.permissionBox}>
                    <Text style={styles.permissionText}>Camera access is required for skin analysis.</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={requestPermission}>
                      <Text style={styles.submitButtonText}>Grant Permission</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <View style={styles.cameraWrapper}>
                      <CameraView style={styles.camera} facing="front" ref={cameraRef} />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={handleScanFace} disabled={visionLoading}>
                      {visionLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.submitButtonText}>Scan My Skin</Text>}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : inputType === 'time-slider' ? (
              <View style={styles.sliderContainer}>
                <View style={styles.timeDisplayBox}>
                  <Text style={styles.timeLabel}>Wake</Text>
                  <Text style={styles.boldTime}>{formatTime(timeRange[0])}</Text>
                </View>
                <View style={styles.timeDisplayBox}>
                  <Text style={styles.timeLabel}>Sleep</Text>
                  <Text style={styles.boldTime}>{formatTime(timeRange[1])}</Text>
                </View>
                
                <View style={styles.sliderWrapper}>
                  <MultiSlider
                    values={[timeRange[0], timeRange[1]]}
                    sliderLength={width - 80}
                    onValuesChange={(values) => setTimeRange(values)}
                    min={0}
                    max={24}
                    step={1}
                    allowOverlap={false}
                    snapped
                    selectedStyle={{ backgroundColor: '#111827' }}
                    markerStyle={styles.sliderMarker}
                    trackStyle={styles.sliderTrack}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={() => handleSubmit(`I wake up at ${formatTime(timeRange[0])} and go to sleep at ${formatTime(timeRange[1])}.`)}
                >
                  <Text style={styles.submitButtonText}>Confirm Schedule</Text>
                </TouchableOpacity>
              </View>
            ) : inputType === 'text' ? (
              <View style={styles.textInputContainer}>
                <TextInput 
                  style={styles.textInput} 
                  placeholder="Type your answer here..." 
                  placeholderTextColor="#9CA3AF"
                  value={textAnswer} 
                  onChangeText={setTextAnswer} 
                  multiline 
                  maxLength={250} 
                />
                <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(textAnswer)}>
                  <Text style={styles.submitButtonText}>Submit Response</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                {options.map((opt, index) => {
                  const safeText = getSafeText(opt);
                  return (
                    <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleSubmit(safeText)}>
                      <Text style={styles.optionText}>{safeText}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  container: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  questionCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 32,
  },
  text: { 
    fontSize: 22, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: '#111827', 
    lineHeight: 30 
  },
  contentArea: {
    width: '100%',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: { 
    width: '100%', 
    gap: 12 
  },
  optionButton: { 
    backgroundColor: '#ffffff', 
    paddingVertical: 18, 
    paddingHorizontal: 20, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    alignItems: 'center' 
  },
  optionText: { 
    fontSize: 16, 
    color: '#374151', 
    fontWeight: '600', 
    textAlign: 'center' 
  },
  textInputContainer: { 
    width: '100%', 
    gap: 16 
  },
  textInput: { 
    backgroundColor: '#ffffff', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 16, 
    padding: 20, 
    fontSize: 16, 
    color: '#111827',
    minHeight: 140, 
    textAlignVertical: 'top' 
  },
  sliderContainer: { 
    width: '100%', 
    alignItems: 'center', 
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 24 
  },
  timeDisplayBox: {
    alignItems: 'center'
  },
  timeLabel: { 
    fontSize: 14, 
    color: '#6B7280', 
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  boldTime: { 
    fontWeight: '800', 
    color: '#111827', 
    fontSize: 28 
  },
  sliderWrapper: { 
    width: '100%',
    alignItems: 'center',
    marginVertical: 10
  },
  sliderMarker: { 
    backgroundColor: '#ffffff', 
    borderWidth: 3,
    borderColor: '#111827',
    height: 28, 
    width: 28, 
    borderRadius: 14 
  },
  sliderTrack: { 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#E5E7EB' 
  },
  submitButton: { 
    backgroundColor: '#111827', 
    paddingVertical: 18, 
    paddingHorizontal: 24, 
    borderRadius: 16, 
    alignItems: 'center', 
    width: '100%',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  submitButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  cameraContainer: { 
    width: '100%', 
    alignItems: 'center', 
    gap: 24 
  },
  cameraWrapper: { 
    width: width - 48, 
    height: (width - 48) * 1.33, 
    borderRadius: 24, 
    overflow: 'hidden', 
    backgroundColor: '#000000'
  },
  camera: { 
    flex: 1 
  },
  permissionBox: { 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16 
  },
  permissionText: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#374151',
    lineHeight: 24
  }
});