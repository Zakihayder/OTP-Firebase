import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function App() {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'done'
    const [phone, setPhone] = useState('+92');
    const [code, setCode] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Android may auto-detect the SMS and verify instantly
    useEffect(() => {
        const unsub = auth().onAuthStateChanged((user) => {
            if (user) {
                setStep('done');
                setMessage({ text: '✅ Verification successful!', type: 'success' });
            }
        });
        return unsub;
    }, []);

    const sendOtp = async () => {
        if (!/^\+\d{10,15}$/.test(phone)) {
            return setMessage({ text: 'Enter a valid number, e.g. +923001234567', type: 'error' });
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const result = await auth().signInWithPhoneNumber(phone);
            setConfirmation(result);
            setStep('otp');
            setMessage({ text: 'OTP sent! Check your SMS.', type: 'success' });
        } catch (e) {
            setMessage({ text: e.message || 'Failed to send OTP', type: 'error' });
        }
        setLoading(false);
    };

    const verifyOtp = async () => {
        if (code.length < 6) {
            return setMessage({ text: 'Enter the 6-digit OTP', type: 'error' });
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            await confirmation.confirm(code);
            setStep('done');
            setMessage({ text: '✅ Verification successful!', type: 'success' });
        } catch (e) {
            setMessage({ text: '❌ Invalid or expired OTP. Try again.', type: 'error' });
        }
        setLoading(false);
    };

    const reset = async () => {
        try { await auth().signOut(); } catch { }
        setStep('phone'); setCode(''); setConfirmation(null);
        setMessage({ text: '', type: '' });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Text style={styles.title}>Phone Verification</Text>

            {step === 'phone' && (
                <>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput style={styles.input} value={phone} onChangeText={setPhone}
                        keyboardType="phone-pad" placeholder="+923001234567" />
                    <Button title="Send OTP" onPress={sendOtp} loading={loading} />
                </>
            )}

            {step === 'otp' && (
                <>
                    <Text style={styles.label}>Enter OTP sent to {phone}</Text>
                    <TextInput style={styles.input} value={code} onChangeText={setCode}
                        keyboardType="number-pad" maxLength={6} placeholder="123456" />
                    <Button title="Verify OTP" onPress={verifyOtp} loading={loading} />
                    <TouchableOpacity onPress={reset}>
                        <Text style={styles.link}>Change number / Resend</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 'done' && <Button title="Start Over" onPress={reset} />}

            {!!message.text && (
                <Text style={[styles.message, message.type === 'error' ? styles.error : styles.success]}>
                    {message.text}
                </Text>
            )}
        </KeyboardAvoidingView>
    );
}

const Button = ({ title, onPress, loading }) => (
    <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f5f6fa' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 8 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 14, fontSize: 18, marginBottom: 16 },
    button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    link: { color: '#4f46e5', textAlign: 'center', marginTop: 16 },
    message: { marginTop: 24, textAlign: 'center', fontSize: 16 },
    error: { color: '#dc2626' },
    success: { color: '#16a34a' },
});