






























































































































































































































                    




                    































































  








import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator, Animated, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
const API_URL = 'http://10.180.8.239:3000/api/task-coach';
const BREAKDOWN_URL = 'http://10.180.8.239:3000/api/breakdown-goals';
Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
});

export default function Pathway() {
  const params = useLocalSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [xp, setXp] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const [activeTask, setActiveTask] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingModule, setIsLoadingModule] = useState(false);
  const [moduleData, setModuleData] = useState<any>(null);

  const breatheScale = useRef(new Animated.Value(1)).current;
  const [journalText, setJournalText] = useState('');
  const [goalBreakdown, setGoalBreakdown] = useState('');
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2700);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    try {
      const dataParam = Array.isArray(params.data) ? params.data[0] : params.data;
      if (dataParam) setTasks(JSON.parse(decodeURIComponent(dataParam)));
    } catch (error) {}
  }, [params.data]);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const updateTaskText = (id: number, newText: string) => {
    setTasks(currentTasks => currentTasks.map(task => task.id === id ? { ...task, task: newText } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
  };

  const openInteractiveModule = async (task: any) => {
    if (isEditing) return;

    setActiveTask(task);
    setModalVisible(true);
    setIsLoadingModule(true);
    setModuleData(null);
    setJournalText('');
    setGoalBreakdown('');
    setTimeLeft(2700);
    setTimerActive(false);

    try {
      const response = await axios.post(API_URL, { taskName: task.task });
      const data = response.data;
      setModuleData(data);

      if (data.type === 'focus_timer' && data.duration) setTimeLeft(data.duration);

      if (data.type === 'breathing') {
        Animated.loop(Animated.sequence([
            Animated.timing(breatheScale, { toValue: 2, duration: 4000, useNativeDriver: true }),
            Animated.timing(breatheScale, { toValue: 1, duration: 4000, useNativeDriver: true })
        ])).start();
      }
    } catch (err) {
      alert("Failed to load module. Check connection.");
    } finally {
      setIsLoadingModule(false);
    }
  };

  const handleGoalSubmit = async () => {
    if (!journalText.trim()) return;
    setIsBreakingDown(true);
    Keyboard.dismiss(); 
    try {
      const response = await axios.post(BREAKDOWN_URL, { goals: journalText });
      setGoalBreakdown(response.data.breakdown);
    } catch (error) {} finally { setIsBreakingDown(false); }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const finishTask = () => {
    toggleTask(activeTask.id);
    setModalVisible(false);
    breatheScale.stopAnimation();
    setTimerActive(false);
  };

  const toggleTask = (id: number) => {
    if (isEditing) return;
    setTasks(currentTasks => currentTasks.map(task => {
        if (task.id === id) {
          const newStatus = !task.completed;
          setXp(prev => newStatus ? prev + task.xp : prev - task.xp);
          return { ...task, completed: newStatus };
        }
        return task;
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerSubtitle}>YOUR MASTER</Text>
            <Text style={styles.header}>Blueprint</Text>
          </View>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editToggleBtn}>
            <Text style={styles.editToggleText}>{isEditing ? "Save" : "Edit"}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>{xp} points Earned</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item, index }) => (
          <View style={[styles.taskRow, item.completed && styles.cardCompleted]}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{item.time}</Text>
              {index !== tasks.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <TouchableOpacity 
              style={[styles.taskCard, item.isFocusSession && styles.taskCardFocus]} 
              onPress={() => openInteractiveModule(item)} 
              activeOpacity={isEditing ? 1 : 0.7}
            >
              {isEditing ? (
                <View style={styles.editRow}>
                  <TextInput 
                    style={styles.editInput} 
                    value={item.task} 
                    onChangeText={(text) => updateTaskText(item.id, text)} 
                    multiline 
                  />
                  <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.taskText, item.completed && styles.textCompleted, item.isFocusSession && styles.taskTextFocus]}>
                  {item.task}
                </Text>
              )}

              {!isEditing && (
                <View style={[styles.actionBtn, item.completed && styles.actionBtnCompleted, item.isFocusSession && !item.completed && styles.actionBtnFocus]}>
                  <Text style={[styles.actionBtnText, item.completed && styles.actionBtnTextCompleted, item.isFocusSession && !item.completed && styles.actionBtnTextFocus]}>
                    {item.completed ? '✓ Completed' : `Start (+${item.xp} XP)`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal animationType="slide" transparent={false} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => { setModalVisible(false); breatheScale.stopAnimation(); setTimerActive(false); }}>
              <Text style={styles.closeText}>✕ Close</Text>
            </TouchableOpacity>

            {isLoadingModule ? (
              <View style={styles.centerContent}><ActivityIndicator size="large" color="#111827" /></View>
            ) : moduleData ? (
              
             
              <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.moduleWrapper} showsVerticalScrollIndicator={false}>
                <View>
                  <Text style={styles.moduleTitle}>{moduleData.title}</Text>
                  <Text style={styles.modulePrompt}>{moduleData.prompt}</Text>
                </View>

                {/* --- MODULES --- */}
                {moduleData.type === 'breathing' && (
                  <View style={styles.centerContent}>
                    <Animated.View style={[styles.breatheCircle, { transform: [{ scale: breatheScale }] }]} />
                  </View>
                )}

                {moduleData.type === 'goal_setter' && (
                  <View style={styles.journalContainer}>
                    <TextInput style={styles.journalInput} placeholder="Brain dump your thoughts..." multiline value={journalText} onChangeText={setJournalText} />
                    {!goalBreakdown && (
                      <TouchableOpacity style={styles.primaryBtn} onPress={handleGoalSubmit}>
                        {isBreakingDown ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Analyze</Text>}
                      </TouchableOpacity>
                    )}
                    {goalBreakdown ? (
                     
                      <View style={styles.breakdownBox}><Text style={styles.breakdownText}>{goalBreakdown}</Text></View>
                    ) : null}
                  </View>
                )}

                {moduleData.type === 'focus_timer' && (
                  <View style={styles.centerContent}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => setTimerActive(!timerActive)}>
                      <Text style={styles.primaryBtnText}>{timerActive ? "Pause" : "Start Focus"}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {moduleData.type === 'recipe' && moduleData.recipeDetails && (
                 
                  <View style={styles.recipeContainer}>
                    <View style={styles.macroBox}>
                      <Text style={styles.macroText}>📊 {moduleData.recipeDetails.macros}</Text>
                    </View>
                    
                    <Text style={styles.recipeSectionTitle}>Ingredients</Text>
                    <View style={styles.recipeCard}>
                      {moduleData.recipeDetails.ingredients?.map((ing: string, idx: number) => (
                        <Text key={idx} style={styles.recipeListItem}>• {ing}</Text>
                      ))}
                    </View>
                    
                    <Text style={styles.recipeSectionTitle}>Instructions</Text>
                    <View style={styles.recipeCard}>
                      {moduleData.recipeDetails.instructions?.map((inst: string, idx: number) => (
                        <Text key={idx} style={styles.recipeListItem}>{idx + 1}. {inst}</Text>
                      ))}
                    </View>
                  </View>
                )}

                {moduleData.type === 'routine' && moduleData.routineDetails && (
                 
                  <View style={styles.recipeContainer}>
                    <Text style={styles.recipeSectionTitle}>Application Steps</Text>
                    <View style={styles.recipeCard}>
                      {moduleData.routineDetails.steps?.map((step: string, idx: number) => (
                        <Text key={idx} style={styles.recipeListItem}>
                          {idx + 1}. {step}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <TouchableOpacity style={[styles.claimButton, (moduleData.type === 'focus_timer' && timeLeft > 0) ? styles.claimDisabled : null]} onPress={finishTask} disabled={moduleData.type === 'focus_timer' && timeLeft > 0}>
                  <Text style={styles.claimButtonText}>Complete Module</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F9FAFB' },
  
  
  headerCard: { backgroundColor: '#ffffff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginBottom: 32, marginTop: Platform.OS === 'ios' ? 40 : 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerSubtitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 1.5, marginBottom: 4 },
  header: { fontSize: 28, fontWeight: '800', color: '#111827' },
  editToggleBtn: { backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  editToggleText: { fontWeight: '700', color: '#374151', fontSize: 14 },
  xpBadge: { backgroundColor: '#ECFDF5', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  xpText: { fontSize: 14, fontWeight: '800', color: '#059669' },
  
  
  taskRow: { flexDirection: 'row', marginBottom: 16 },
  cardCompleted: { opacity: 0.5 },
  timeColumn: { width: 70, alignItems: 'center', marginRight: 16 },
  timeText: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 8, marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', borderRadius: 2 },
  
  
  taskCard: { flex: 1, backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  taskCardFocus: { backgroundColor: '#111827', borderColor: '#111827' },
  taskText: { fontSize: 16, color: '#111827', marginBottom: 16, fontWeight: '600', lineHeight: 24 },
  taskTextFocus: { color: '#ffffff' },
  textCompleted: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  
  
  editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  editInput: { flex: 1, borderBottomWidth: 1, borderColor: '#D1D5DB', fontSize: 16, color: '#111827', paddingVertical: 8, marginRight: 12 },
  deleteBtn: { backgroundColor: '#FEE2E2', padding: 8, borderRadius: 8 },
  deleteBtnText: { fontSize: 14, color: '#EF4444', fontWeight: '900' },
  
  
  actionBtn: { paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  actionBtnCompleted: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  actionBtnFocus: { backgroundColor: '#ffffff', borderColor: '#ffffff' },
  actionBtnText: { color: '#374151', fontWeight: '700', fontSize: 14 },
  actionBtnTextCompleted: { color: '#9CA3AF' },
  actionBtnTextFocus: { color: '#111827' },
  
  
  modalContainer: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: Platform.OS === 'ios' ? 60 : 30 },
  closeButton: { alignSelf: 'flex-end', paddingHorizontal: 24, paddingVertical: 12 },
  closeText: { fontSize: 16, color: '#6B7280', fontWeight: '700' },
  moduleWrapper: { flex: 1, padding: 24, justifyContent: 'space-between' },
  moduleTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 },
  modulePrompt: { fontSize: 16, color: '#6B7280', lineHeight: 24, marginBottom: 32 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  
  breatheCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#DBEAFE', borderWidth: 2, borderColor: '#60A5FA' },
  
  
  journalContainer: { flex: 1 },
  journalInput: { height: 160, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 20, padding: 20, fontSize: 16, color: '#111827', textAlignVertical: 'top', marginBottom: 16 },
  breakdownBox: { flex: 1, backgroundColor: '#ECFDF5', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#D1FAE5' },
  breakdownText: { fontSize: 16, color: '#065F46', lineHeight: 26 },
  
  
  timerText: { fontSize: 72, fontWeight: '800', color: '#111827', marginBottom: 40, fontVariant: ['tabular-nums'] },
  
  
  recipeContainer: { flex: 1, marginTop: 10 },
  macroBox: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 16, marginBottom: 24, alignItems: 'center' },
  macroText: { fontSize: 14, color: '#374151', fontWeight: '700', letterSpacing: 0.5 },
  recipeSectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  recipeCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 },
  recipeListItem: { fontSize: 15, color: '#4B5563', marginBottom: 10, lineHeight: 24 },
  
  
  primaryBtn: { backgroundColor: '#111827', paddingVertical: 16, borderRadius: 16, alignItems: 'center', shadowColor: '#111827', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  claimButton: { backgroundColor: '#10B981', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  claimDisabled: { backgroundColor: '#D1D5DB', shadowOpacity: 0 },
  claimButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '800' }
});