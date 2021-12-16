import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../../../styles/global";
import { FontAwesome } from "@expo/vector-icons";

export default function Guide({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.guideHeader}>
        <View style={globalStyles.guideHeader_title}>
          <Text>Đây là trang hướng dẫn các tính năng của wiki chatbot</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="times" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* google search */}
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_title}>
          Tìm kiếm trên Google
        </Text>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp :search + nội dung muốn tìm {"\n"}
            Ví dụ: ':search chatbot là gì'
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>
            Mô tả: Wiki sẽ giúp bạn tìm kiếm thông tin trên Google dễ dàng
          </Text>
        </Text>
      </View>

      {/* wikipedia search */}
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_title}>
          Tìm kiếm trên Wikipedia
        </Text>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp :wiki + nội dung muốn tìm {"\n"}
            Ví dụ: ':wiki xe hơi'
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>
            Mô tả: Wiki sẽ tìm giúp bạn thông tin đã được tóm gọn lại bởi
            wikipedia
          </Text>
        </Text>
      </View>

      {/* calculator */}
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_title}>
          Tính toán các phép tính đơn giản
        </Text>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp: Bạn có thể hỏi các câu liên quan tới tính toán như '1 + 2
            bằng mấy' hoặc chỉ đơn giản là nhắn '2 * 3' {"\n"}
            Ví dụ: '23 * 78 bằng mấy?'
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>
            Mô tả: Wiki sẽ giúp bạn tính toán các phép tính tưởng chừng như
            không hề khó mà lại khó không tưởng 😁
          </Text>
        </Text>
      </View>

      {/* image to text */}
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_title}>
          Chuyển hình ảnh có chữ thành văn bản
        </Text>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp :totext hoặc :totext&eng + ảnh có chữ {"\n"}
            Ví dụ: ':totext + hình ảnh'
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>
            Mô tả: Wiki sẽ giúp bạn chuyển đổi hình ảnh có chữ thành văn bản và
            có thể dễ dàng copy để dùng cho mục đích cá nhân. {"\n"}
            Sẽ có 2 ngôn ngữ được chuyển thành văn bản là tiếng Việt và tiếng
            Anh. Ở đây :totext sẽ mặc định là tiếng Việt và :totext&eng sẽ là
            tiếng Anh.
          </Text>
        </Text>
      </View>

      {/* film recommendation */}
      <View style={globalStyles.guideFeature}>
        <Text style={globalStyles.guideFeature_title}>
          Gợi ý phim dựa trên thể loại
        </Text>
        <Text style={globalStyles.guideFeature_body}>
          <Text style={globalStyles.guideFeature_syntax}>
            Cú pháp :movie + thể loại phim {"\n"}
            Ví dụ: ':movie superhero'
          </Text>
          {"\n"}
          <Text style={globalStyles.guideFeature_description}>
            Mô tả: Wiki sẽ gợi ý các phim liên quan đến thể loại bạn nhập vào.
            Lưu ý là phần lớn các phim được gợi ý là những phim cũ, có những
            phim từ những năm 19xx :v do dữ liệu được sử dụng đã cũ.
          </Text>
        </Text>
      </View>
    </View>
  );
}
