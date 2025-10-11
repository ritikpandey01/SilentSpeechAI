"""
Debug script to identify and fix prediction issues
Run this to diagnose problems with your LipNet model
"""

import os
import sys
import tensorflow as tf
import numpy as np
from utils import load_data, num_to_char, char_to_num
from modelutil import load_model

def print_section(title):
    print("\n" + "="*60)
    print(f" {title}")
    print("="*60)

def check_data_integrity():
    """Check if data files are accessible and valid"""
    print_section("1. DATA INTEGRITY CHECK")
    
    data_path = os.path.join('..', 'data', 's1')
    align_path = os.path.join('..', 'data', 'alignments', 's1')
    
    if not os.path.exists(data_path):
        print("❌ Video data directory not found!")
        return False
    
    if not os.path.exists(align_path):
        print("❌ Alignment data directory not found!")
        return False
    
    videos = [f for f in os.listdir(data_path) if f.endswith(('.mpg', '.mp4'))]
    alignments = [f for f in os.listdir(align_path) if f.endswith('.align')]
    
    print(f"✅ Found {len(videos)} video files")
    print(f"✅ Found {len(alignments)} alignment files")
    
    # Check sample file
    if videos:
        sample_video = os.path.join(data_path, videos[0])
        sample_align = os.path.join(align_path, videos[0].replace('.mpg', '.align').replace('.mp4', '.align'))
        
        if os.path.exists(sample_align):
            print(f"✅ Sample files paired correctly")
            return True
        else:
            print(f"⚠️  Warning: Some videos may not have alignment files")
            return True
    
    return False

def check_model_architecture():
    """Verify model architecture"""
    print_section("2. MODEL ARCHITECTURE CHECK")
    
    try:
        model = load_model()
        print("✅ Model loaded successfully")
        print(f"\nModel Summary:")
        model.summary()
        
        # Check if model has been trained
        print(f"\nTotal parameters: {model.count_params():,}")
        
        return model
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return None

def test_single_prediction(model):
    """Test prediction on a single video"""
    print_section("3. SINGLE PREDICTION TEST")
    
    try:
        # Get a test video
        data_path = os.path.join('..', 'data', 's1')
        videos = [f for f in os.listdir(data_path) if f.endswith(('.mpg', '.mp4'))]
        
        if not videos:
            print("❌ No test videos found")
            return False
        
        test_video = os.path.join(data_path, videos[0])
        print(f"Testing with: {videos[0]}")
        
        # Load data
        print("Loading video data...")
        frames, alignments = load_data(tf.convert_to_tensor(test_video))
        print(f"✅ Video loaded: {frames.shape}")
        print(f"✅ Alignments loaded: {alignments.shape}")
        
        # Get ground truth
        ground_truth = tf.strings.reduce_join([num_to_char(word) for word in alignments]).numpy().decode('utf-8')
        print(f"\n📖 Ground Truth: '{ground_truth}'")
        
        # Make prediction
        print("\nMaking prediction...")
        yhat = model.predict(tf.expand_dims(frames, axis=0), verbose=0)
        print(f"✅ Prediction tensor shape: {yhat.shape}")
        print(f"   Prediction range: [{yhat.min():.4f}, {yhat.max():.4f}]")
        
        # Decode prediction
        decoder = tf.keras.backend.ctc_decode(yhat, [75], greedy=True)[0][0].numpy()
        prediction = tf.strings.reduce_join(num_to_char(decoder)).numpy().decode('utf-8')
        
        print(f"\n🤖 Model Prediction: '{prediction}'")
        
        # Analyze prediction quality
        if prediction.strip() == "":
            print("\n⚠️  WARNING: Empty prediction!")
            print("   This suggests the model is not trained or weights are incorrect")
        elif len(set(prediction)) < 3:
            print("\n⚠️  WARNING: Very limited character diversity!")
            print("   This suggests the model is outputting mostly blank/repeated characters")
        elif prediction == ground_truth:
            print("\n✅ Perfect prediction!")
        else:
            # Calculate rough similarity
            matching_chars = sum(1 for a, b in zip(prediction, ground_truth) if a == b)
            similarity = matching_chars / max(len(prediction), len(ground_truth)) * 100
            print(f"\n📊 Prediction similarity: {similarity:.1f}%")
            
            if similarity < 20:
                print("   ⚠️  Low similarity - model needs (re)training")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during prediction test: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_vocabulary():
    """Verify vocabulary consistency"""
    print_section("4. VOCABULARY CHECK")
    
    try:
        vocab = [x for x in "abcdefghijklmnopqrstuvwxyz'?!123456789 "]
        print(f"✅ Vocabulary size: {len(vocab) + 1} (including blank)")
        print(f"   Characters: {vocab}")
        
        # Test character mapping
        test_chars = ['h', 'e', 'l', 'l', 'o']
        encoded = char_to_num(test_chars)
        decoded = num_to_char(encoded)
        result = ''.join([x.numpy().decode('utf-8') for x in decoded])
        
        if result == 'hello':
            print(f"✅ Character encoding/decoding working correctly")
            return True
        else:
            print(f"❌ Character mapping error: 'hello' -> '{result}'")
            return False
            
    except Exception as e:
        print(f"❌ Error checking vocabulary: {str(e)}")
        return False

def suggest_fixes():
    """Provide recommendations based on test results"""
    print_section("5. RECOMMENDATIONS")
    
    print("""
Based on the diagnostic results, here are potential fixes:

1. ❌ If predictions are random/garbage:
   → The model needs to be trained or retrained
   → Run the training notebook cells again (Section 4)
   → Ensure checkpoint files are being saved correctly

2. ❌ If model loads but outputs are wrong:
   → Check that checkpoint path matches: '../models/checkpoint'
   → Verify checkpoint files exist and aren't corrupted
   → Try re-downloading the pretrained weights

3. ❌ If character mappings are wrong:
   → Ensure vocabulary in utils.py matches training vocab
   → Verify num_to_char and char_to_num layers are correct

4. ❌ If video loading fails:
   → Check FFmpeg is installed: 'ffmpeg -version'
   → Verify video paths are correct
   → Ensure alignment files exist for each video

5. ✅ Quick fix attempt:
   → Delete checkpoint files and retrain from scratch
   → Use the training code in the notebook (Section 4)
   → Start with 10-20 epochs to see improvement

6. 🔄 To retrain the model:
   ```python
   from modelutil import retrain_model_if_needed
   model = load_model()
   model, history = retrain_model_if_needed(model, train, test, epochs=20)
   ```
""")

def main():
    """Run all diagnostic checks"""
    print("\n" + "🔍" * 30)
    print(" LipNet Model Diagnostic Tool")
    print("🔍" * 30)
    
    # Run checks
    data_ok = check_data_integrity()
    model = check_model_architecture() if data_ok else None
    vocab_ok = check_vocabulary()
    prediction_ok = test_single_prediction(model) if model else False
    
    # Summary
    print_section("DIAGNOSTIC SUMMARY")
    print(f"Data Integrity:     {'✅' if data_ok else '❌'}")
    print(f"Model Architecture: {'✅' if model else '❌'}")
    print(f"Vocabulary:         {'✅' if vocab_ok else '❌'}")
    print(f"Predictions:        {'✅' if prediction_ok else '❌'}")
    
    # Recommendations
    suggest_fixes()

if __name__ == "__main__":
    main()